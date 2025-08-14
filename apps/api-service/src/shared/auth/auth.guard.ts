import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import * as jwt from "jsonwebtoken"
import { statusMessages } from "../constants/status-messages"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { EventMap } from "../utils/event.map"
import { ModRequest } from "./types/mod-request.interface"
import { User } from "@/auth/schemas/user.schema"
import { Response } from "express"
import { Token } from "@/core/token/schemas/token.schema"
import { prodUIURI } from "../constants/other-constants"
import { config } from "@/config"

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
        const decodedAccessToken = jwt.verify(accessToken, config.JWT_SECRET, {
          algorithms: ["HS512"],
        })
        const userId = (decodedAccessToken as any).id
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
        const decodedAccessToken = jwt.decode(String(accessToken))
        const userId = (decodedAccessToken as any).id
        const refreshTokenFromDB: Token = (
          await this.eventEmitter.emitAsync(EventMap.GetToken, {
            userId,
          })
        ).shift()

        if (!refreshTokenFromDB || refreshToken !== refreshTokenFromDB.token) {
          throw new UnauthorizedException(statusMessages.unauthorized)
        } else {
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
          const newAccessToken = jwt.sign(tokenPayload, config.JWT_SECRET, {
            algorithm: "HS512",
            expiresIn: "5m",
          })
          globalResponse.setHeader("token", newAccessToken)
          return true
        }
      } else {
        throw new UnauthorizedException(statusMessages.unauthorized)
      }
    }
  }
}
