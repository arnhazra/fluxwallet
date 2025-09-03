import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { statusMessages } from "../shared/constants/status-messages"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { EventMap } from "../shared/constants/event.map"
import { User } from "@/auth/schemas/user.schema"
import { Response, Request } from "express"
import { Token } from "./schemas/token.schema"
import { prodUIURI } from "../shared/constants/other-constants"
import {
  decodeAccessToken,
  generateToken,
  TokenType,
  verifyAccessToken,
} from "@/auth/utils/jwt.util"
import * as jwt from "jsonwebtoken"

export interface ModRequest extends Request {
  user: {
    userId: string
    role: string
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: ModRequest = context.switchToHttp().getRequest()
    const globalResponse: Response = context.switchToHttp().getResponse()
    const accessToken = request.headers["authorization"]?.split(" ")[1]
    const refreshToken = request.headers["refresh_token"]

    try {
      if (!accessToken || !refreshToken) {
        throw new UnauthorizedException(statusMessages.unauthorized)
      } else {
        const decodedAccessToken = verifyAccessToken(accessToken)
        const userId = decodedAccessToken.id
        const userResponse: User[] = await this.eventEmitter.emitAsync(
          EventMap.GetUserDetails,
          { _id: userId }
        )

        if (!userResponse || !userResponse.length) {
          throw new UnauthorizedException(statusMessages.unauthorized)
        } else {
          const { activityLog, role } = userResponse.shift()
          request.user = { userId, role }

          if (activityLog) {
            const { method, url: apiUri } = request
            this.eventEmitter.emit(EventMap.CreateActivity, {
              userId,
              method,
              apiUri,
            })
          }

          return true
        }
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        const decodedAccessToken = decodeAccessToken(accessToken)
        const userId = decodedAccessToken.id
        const refreshTokenFromDB: Token = (
          await this.eventEmitter.emitAsync(EventMap.GetRefreshToken, {
            userId,
          })
        ).shift()

        if (!refreshTokenFromDB || refreshToken !== refreshTokenFromDB.token) {
          throw new UnauthorizedException(statusMessages.unauthorized)
        }

        const user: User[] = await this.eventEmitter.emitAsync(
          EventMap.GetUserDetails,
          { _id: userId }
        )
        const { activityLog, email, role } = user?.shift()
        request.user = { userId, role }

        if (activityLog) {
          const { method, url: apiUri } = request
          this.eventEmitter.emit(EventMap.CreateActivity, {
            userId,
            method,
            apiUri,
          })
        }

        const tokenPayload = {
          id: userId,
          email,
          iss: prodUIURI,
        }
        const newAccessToken = generateToken(
          tokenPayload,
          TokenType.AccessToken
        )
        globalResponse.setHeader("token", newAccessToken)
        return true
      } else {
        throw new UnauthorizedException(statusMessages.unauthorized)
      }
    }
  }
}
