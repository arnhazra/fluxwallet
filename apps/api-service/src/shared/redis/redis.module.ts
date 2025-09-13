import { DynamicModule, Global, Module } from "@nestjs/common"
import Redis from "ioredis"
import { RedisService } from "./redis.service"
import { config } from "@/config"

@Global()
@Module({})
export class RedisModule {
  static forRoot(): DynamicModule {
    const redisProvider = {
      provide: "REDIS_CLIENT",
      useFactory: () => {
        return new Redis(config.REDIS_URI, { keepAlive: 10000 })
      },
    }

    return {
      module: RedisModule,
      providers: [redisProvider, RedisService],
      exports: [RedisService],
    }
  }
}
