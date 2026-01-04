import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { statusMessages } from "../shared/constants/status-messages"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { AppEventMap } from "../shared/constants/app-events.map"
import { User } from "@/auth/schemas/user.schema"
import { Request } from "express"
import { TokenType, verifyToken } from "@/auth/utils/jwt.util"
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
    const accessToken = request.headers["authorization"]?.split(" ")[1]

    try {
      if (!accessToken) {
        throw new UnauthorizedException(statusMessages.accessTokenMissing)
      }

      const decodedAccessToken = verifyToken(accessToken, TokenType.AccessToken)
      const userId = decodedAccessToken.id
      const userResponse: User[] = await this.eventEmitter.emitAsync(
        AppEventMap.GetUserDetails,
        userId
      )

      if (!userResponse || !userResponse.length) {
        throw new UnauthorizedException(statusMessages.invalidUser)
      }

      const { analyticsData, role } = userResponse.shift()
      request.user = { userId, role }
      const { method, url: apiUri } = request
      this.eventEmitter.emit(AppEventMap.CreateAnalytics, {
        userId: analyticsData ? userId : null,
        method,
        apiUri,
      })
      return true
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException(statusMessages.accessTokenExpired)
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException(statusMessages.accessTokenInvalid)
      }

      throw new UnauthorizedException(statusMessages.unauthorized)
    }
  }
}
