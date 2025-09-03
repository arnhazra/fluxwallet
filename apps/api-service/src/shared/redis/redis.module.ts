import { DynamicModule, Global, Module } from "@nestjs/common"
import Redis from "ioredis"
import { RedisService } from "./redis.service"

export interface RedisModuleOptions {
  host: string
  port: number
  password?: string
  db?: number
}

@Global()
@Module({})
export class RedisModule {
  static forRoot(options: RedisModuleOptions): DynamicModule {
    const redisProvider = {
      provide: "REDIS_CLIENT",
      useFactory: () => {
        return new Redis({
          host: options.host,
          port: options.port,
          password: options.password,
          db: options.db ?? 0,
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
