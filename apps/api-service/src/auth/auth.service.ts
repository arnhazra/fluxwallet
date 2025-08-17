import { BadRequestException, Injectable } from "@nestjs/common"
import { RequestOTPDto } from "./dto/request-otp.dto"
import { VerifyOTPDto } from "./dto/validate-otp.dto"
import { config } from "src/config"
import {
  requestOTP,
  verifyOTP,
  requestOTPEmailBody,
  requestOTPEmailSubject,
} from "./utils/otp.util"
import { prodUIURI } from "@/shared/constants/other-constants"
import { statusMessages } from "@/shared/constants/status-messages"
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/utils/event.map"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { FindUserByEmailQuery } from "./queries/impl/find-user-by-email.query"
import { User } from "./schemas/user.schema"
import { FindUserByIdQuery } from "./queries/impl/find-user-by-id.query"
import { CreateUserCommand } from "./commands/impl/create-user.command"
import { UpdateAttributeCommand } from "./commands/impl/update-attribute.command"
import { Subscription } from "../core/subscription/schemas/subscription.schema"
import { Token } from "./schemas/token.schema"
import { GoogleOAuthDto } from "./dto/google-oauth.dto"
import { HttpService } from "@nestjs/axios"
import { lastValueFrom } from "rxjs"
import { SetTokenDto } from "./dto/set-token.dto"
import { GetTokenDto } from "./dto/get-token.dto"
import { DeleteTokenDto } from "./dto/delete-token.dto"
import { SetTokenCommand } from "./commands/impl/set-token.command"
import { GetTokenQuery } from "./queries/impl/get-token.query"
import { DeleteTokenCommand } from "./commands/impl/delete-token.command"
import { generateToken, TokenType } from "@/auth/utils/jwt.util"
import { SetOTPCommand } from "./commands/impl/set-otp.command"
import { GetOTPQuery } from "./queries/impl/get-otp.query"
import { OneTimePassword } from "./schemas/otp.schema"
import { DeleteOTPCommand } from "./commands/impl/delete-otp.command"

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
        const refreshTokenFromDB = await this.getRefreshToken({
          userId: user.id,
        })

        if (refreshTokenFromDB) {
          const refreshToken = refreshTokenFromDB.token
          const tokenPayload = {
            id: user.id,
            email: user.email,
            iss: prodUIURI,
          }
          const accessToken = generateToken(tokenPayload, TokenType.AccessToken)
          return { accessToken, refreshToken, user, success: true }
        } else {
          const tokenPayload = {
            id: user.id,
            email: user.email,
            iss: prodUIURI,
          }
          const accessToken = generateToken(tokenPayload, TokenType.AccessToken)
          const refreshToken = generateToken(
            tokenPayload,
            TokenType.RefreshToken
          )
          await this.setRefreshToken({ userId: user.id, token: refreshToken })
          return { accessToken, refreshToken, user, success: true }
        }
      } else {
        const newUser = await this.commandBus.execute<CreateUserCommand, User>(
          new CreateUserCommand(email, name)
        )

        const tokenPayload = {
          id: newUser.id,
          email: newUser.email,
          iss: prodUIURI,
        }
        const accessToken = generateToken(tokenPayload, TokenType.AccessToken)
        const refreshToken = generateToken(tokenPayload, TokenType.RefreshToken)
        await this.setRefreshToken({
          userId: newUser.id,
          token: refreshToken,
        })
        return { accessToken, refreshToken, user: newUser, success: true }
      }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
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
      this.updateAttribute(derivedUserId as string, "avatar", data.picture)
      return resp
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
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
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async verifyOTP(verifyOTPDto: VerifyOTPDto) {
    try {
      const { email, otp, name } = verifyOTPDto
      const { hashedOTP } = await this.getOTP(email)
      const isOTPValid = verifyOTP(email, hashedOTP, otp)

      if (isOTPValid) {
        this.deleteOTP(email)
        return await this.userRegistrationOrLogin(email, name)
      } else {
        throw new BadRequestException(statusMessages.connectionError)
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async getUserDetails(userId: string) {
    try {
      const user = await this.queryBus.execute<FindUserByIdQuery, User>(
        new FindUserByIdQuery(userId)
      )

      if (user) {
        const subscriptionRes: Subscription[] =
          await this.eventEmitter.emitAsync(
            EventMap.GetSubscriptionDetails,
            userId
          )

        let subscription: Subscription | null

        if (!subscriptionRes || !subscriptionRes.length) {
          subscription = null
        } else {
          subscription = subscriptionRes.shift()
        }

        const isSubscriptionActive =
          subscription && new Date(subscription.endsAt) > new Date()

        return { user, subscription, isSubscriptionActive }
      } else {
        throw new BadRequestException(statusMessages.invalidUser)
      }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async signOut(userId: string) {
    try {
      await this.deleteRefreshToken({ userId })
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @OnEvent(EventMap.UpdateAttribute)
  async updateAttribute<K extends keyof User>(
    userId: string,
    attributeName: K,
    attributeValue: User[K]
  ) {
    try {
      await this.commandBus.execute<UpdateAttributeCommand, User>(
        new UpdateAttributeCommand(userId, attributeName, attributeValue)
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async setRefreshToken(setTokenDto: SetTokenDto) {
    try {
      const { userId, token } = setTokenDto
      return await this.commandBus.execute(new SetTokenCommand(userId, token))
    } catch (error) {
      throw new BadRequestException()
    }
  }

  @OnEvent(EventMap.GetRefreshToken)
  async getRefreshToken(getTokenDto: GetTokenDto) {
    try {
      const { userId } = getTokenDto
      return await this.queryBus.execute<GetTokenQuery, Token>(
        new GetTokenQuery(userId)
      )
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async deleteRefreshToken(deleteTokenDto: DeleteTokenDto) {
    try {
      const { userId } = deleteTokenDto
      return await this.commandBus.execute(new DeleteTokenCommand(userId))
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async setOTP(email: string, otpHash: string) {
    try {
      return await this.commandBus.execute(new SetOTPCommand(email, otpHash))
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async getOTP(email: string) {
    try {
      const response = await this.queryBus.execute<
        GetOTPQuery,
        OneTimePassword
      >(new GetOTPQuery(email))

      if (!response) throw new BadRequestException()
      return response
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async deleteOTP(email: string) {
    try {
      return await this.commandBus.execute(new DeleteOTPCommand(email))
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
