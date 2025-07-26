import { Module } from "@nestjs/common"
import { TokenService } from "./token.service"
import { TokenController } from "./token.controller"
import Redis from "ioredis"
import { config } from "src/config"

@Module({
  controllers: [TokenController],
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory: () => {
        const redis = new Redis(config.REDIS_URI, {
          reconnectOnError(err) {
            const targetError = "ECONNRESET"
            if (err.message.includes(targetError)) {
              return true
            }
          },
        })
        return redis
      },
    },
    TokenService,
  ],
})
export class TokenModule {}
