import { Module } from "@nestjs/common"
import { PlatformModule } from "./platform/platform.module"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { MainController } from "./main.controller"
import { AuthModule } from "./auth/auth.module"
import { AppsModule } from "./apps/apps.module"
import { SharedModule } from "./shared/shared.module"
import { RedisModule } from "./shared/redis/redis.module"

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RedisModule.forRoot(),
    AuthModule,
    PlatformModule,
    AppsModule,
    SharedModule,
  ],
  controllers: [MainController],
  providers: [],
})
export class MainModule {}
