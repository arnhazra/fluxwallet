import { Injectable, UnauthorizedException } from "@nestjs/common"
import { RequestOTPDto } from "./dto/request-otp.dto"
import { VerifyOTPDto } from "./dto/validate-otp.dto"
import { config } from "src/config"
import {
  requestOTP,
  verifyOTP,
  requestOTPEmailBody,
  requestOTPEmailSubject,
} from "./utils/otp.util"
import { statusMessages } from "@/shared/constants/status-messages"
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/constants/event.map"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { FindUserByEmailQuery } from "./queries/impl/find-user-by-email.query"
import { User } from "./schemas/user.schema"
import { FindUserByIdQuery } from "./queries/impl/find-user-by-id.query"
import { CreateUserCommand } from "./commands/impl/create-user.command"
import { UpdateAttributeCommand } from "./commands/impl/update-attribute.command"
import { Token } from "./schemas/token.schema"
import { GoogleOAuthDto } from "./dto/google-oauth.dto"
import { HttpService } from "@nestjs/axios"
import { lastValueFrom } from "rxjs"
import { SetTokenDto } from "./dto/set-token.dto"
import { GetTokenDto } from "./dto/get-token.dto"
import { DeleteTokenDto } from "./dto/delete-token.dto"
import { SetTokenCommand } from "./commands/impl/set-token.command"
import { GetTokensQuery } from "./queries/impl/get-tokens.query"
import { DeleteTokenCommand } from "./commands/impl/delete-token.command"
import { generateToken, TokenType, verifyToken } from "@/auth/utils/jwt.util"
import { SetOTPCommand } from "./commands/impl/set-otp.command"
import { GetOTPQuery } from "./queries/impl/get-otp.query"
import { OneTimePassword } from "./schemas/otp.schema"
import { DeleteOTPCommand } from "./commands/impl/delete-otp.command"
import { Currency } from "country-code-enum"
import * as jwt from "jsonwebtoken"

@Injectable()
export class AuthService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly httpService: HttpService
  ) {}

  async userRegistrationOrLogin(email: string, name?: string) {
    try {
      const user = await this.queryBus.execute<FindUserByEmailQuery, User>(
        new FindUserByEmailQuery(email)
      )

      if (user) {
        const tokenPayload = {
          id: String(user._id),
          email: user.email,
          iss: config.UI_URL,
        }
        const accessToken = generateToken(tokenPayload, TokenType.AccessToken)
        const refreshToken = generateToken(tokenPayload, TokenType.RefreshToken)
        await this.setRefreshToken({
          userId: String(user._id),
          token: refreshToken,
        })
        return { accessToken, refreshToken, user, success: true }
      } else {
        const newUser = await this.commandBus.execute<CreateUserCommand, User>(
          new CreateUserCommand(email, name)
        )

        const tokenPayload = {
          id: String(newUser._id),
          email: newUser.email,
          iss: config.UI_URL,
        }
        const accessToken = generateToken(tokenPayload, TokenType.AccessToken)
        const refreshToken = generateToken(tokenPayload, TokenType.RefreshToken)
        await this.setRefreshToken({
          userId: String(newUser._id),
          token: refreshToken,
        })
        return { accessToken, refreshToken, user: newUser, success: true }
      }
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async googleOAuth(googleOAuthDto: GoogleOAuthDto) {
    try {
      const response$ = this.httpService.get(
        config.GOOGLE_OAUTH_VERIFICATION_API,
        { headers: { Authorization: `Bearer ${googleOAuthDto.token}` } }
      )
      const { data } = await lastValueFrom(response$)
      const resp = await this.userRegistrationOrLogin(data.email, data.name)
      const {
        user: { _id: derivedUserId },
      } = resp
      this.updateAttribute(
        derivedUserId as unknown as string,
        "avatar",
        data.picture
      )
      return resp
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async requestOTP(requestOTPDto: RequestOTPDto) {
    try {
      const { email } = requestOTPDto
      const user = await this.queryBus.execute<FindUserByEmailQuery, User>(
        new FindUserByEmailQuery(email)
      )
      const { fullHash: hash, otp } = requestOTP(email)
      const subject: string = requestOTPEmailSubject()
      const body: string = requestOTPEmailBody(otp)
      await this.eventEmitter.emitAsync(EventMap.SendEmail, {
        email,
        subject,
        body,
      })
      await this.setOTP(email, hash)
      return { user }
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async validateOTP(verifyOTPDto: VerifyOTPDto) {
    try {
      const { email, otp, name } = verifyOTPDto
      const { hashedOTP } = await this.getOTP(email)
      const isOTPValid = verifyOTP(email, hashedOTP, otp)

      if (isOTPValid) {
        this.deleteOTP(email)
        return await this.userRegistrationOrLogin(email, name)
      } else {
        throw new Error(statusMessages.connectionError)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async refreshTokens(currentRefreshToken: string) {
    try {
      const decodedRefreshToken = verifyToken(
        currentRefreshToken,
        TokenType.RefreshToken
      )
      const userId = decodedRefreshToken.id
      const refreshTokens = await this.getRefreshTokens({ userId })
      const matchRefreshToken = refreshTokens.find(
        (tk) => tk.token === currentRefreshToken
      )

      if (!matchRefreshToken) {
        throw new UnauthorizedException(statusMessages.refreshTokenInvalid)
      }

      const userDetails = await this.getUserDetails(userId)

      const tokenPayload = {
        id: String(userDetails.user._id),
        email: userDetails.user.email,
        iss: config.UI_URL,
      }

      const accessToken = generateToken(tokenPayload, TokenType.AccessToken)
      const refreshToken = generateToken(tokenPayload, TokenType.RefreshToken)
      await this.deleteRefreshToken({ userId, token: currentRefreshToken })
      await this.setRefreshToken({
        userId: String(userDetails.user._id),
        token: refreshToken,
      })
      return { accessToken, refreshToken }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException(statusMessages.refreshTokenExpired)
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException(statusMessages.refreshTokenInvalid)
      }

      throw new UnauthorizedException(statusMessages.unauthorized)
    }
  }

  async getUserDetails(userId: string) {
    try {
      const user = await this.queryBus.execute<FindUserByIdQuery, User>(
        new FindUserByIdQuery(userId)
      )

      if (user) {
        return { user }
      } else {
        throw new Error(statusMessages.invalidUser)
      }
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async signOut(allDevices: boolean, userId: string, refreshToken: string) {
    try {
      if (allDevices) {
        await this.deleteRefreshToken({ userId, token: null })
      } else {
        await this.deleteRefreshToken({ userId, token: refreshToken })
      }
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async updateAttribute<K extends keyof User>(
    userId: string,
    attributeName: K,
    attributeValue: string | number | boolean | null | Currency
  ) {
    try {
      await this.commandBus.execute<UpdateAttributeCommand, User>(
        new UpdateAttributeCommand(userId, attributeName, attributeValue)
      )
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  @OnEvent(EventMap.GetUserDetails)
  async findUser(userId: string): Promise<User | null> {
    try {
      return await this.queryBus.execute<FindUserByIdQuery, User>(
        new FindUserByIdQuery(userId)
      )
    } catch (error) {
      return null
    }
  }

  async setRefreshToken(setTokenDto: SetTokenDto) {
    try {
      const { userId, token } = setTokenDto
      return await this.commandBus.execute(new SetTokenCommand(userId, token))
    } catch (error) {
      throw new Error()
    }
  }

  async getRefreshTokens(getTokenDto: GetTokenDto) {
    try {
      const { userId } = getTokenDto
      return await this.queryBus.execute<GetTokensQuery, Token[]>(
        new GetTokensQuery(userId)
      )
    } catch (error) {
      throw new Error()
    }
  }

  async deleteRefreshToken(deleteTokenDto: DeleteTokenDto) {
    try {
      const { userId, token } = deleteTokenDto
      return await this.commandBus.execute(
        new DeleteTokenCommand(userId, token)
      )
    } catch (error) {
      throw new Error()
    }
  }

  async setOTP(email: string, otpHash: string) {
    try {
      return await this.commandBus.execute(new SetOTPCommand(email, otpHash))
    } catch (error) {
      throw new Error()
    }
  }

  async getOTP(email: string) {
    try {
      const response = await this.queryBus.execute<
        GetOTPQuery,
        OneTimePassword
      >(new GetOTPQuery(email))

      if (!response) throw new Error()
      return response
    } catch (error) {
      throw new Error()
    }
  }

  async deleteOTP(email: string) {
    try {
      return await this.commandBus.execute(new DeleteOTPCommand(email))
    } catch (error) {
      throw new Error()
    }
  }
}
