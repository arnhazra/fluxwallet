import { DynamicModule, Global, Module } from "@nestjs/common"
import Redis from "ioredis"
import { RedisService } from "./redis.service"
import { config } from "@/config"

export interface RedisModuleOptions {
  host: string
  port: number
  password?: string
  db?: number
}

@Global()
@Module({})
export class RedisModule {
  static forRoot(): DynamicModule {
    const redisProvider = {
      provide: "REDIS_CLIENT",
      useFactory: () => {
        return new Redis({
          host: config.REDIS_HOST,
          port: config.REDIS_PORT,
          password: config.REDIS_PASSWORD,
        })
      },
    }

    return {
      module: RedisModule,
      providers: [redisProvider, RedisService],
      exports: [RedisService],
    }
  }
}
