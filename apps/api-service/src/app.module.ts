import { Module } from "@nestjs/common"
import { PlatformModule } from "./platform/platform.module"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { AppController } from "./app.controller"
import { AuthModule } from "./auth/auth.module"
import { ProductsModule } from "./products/products.module"
import { SharedModule } from "./shared/shared.module"
import { RedisModule } from "./shared/redis/redis.module"

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RedisModule.forRoot({
      host: "redis-14955.c212.ap-south-1-1.ec2.redns.redis-cloud.com",
      port: 14955,
      password: "Wu0Gwcdvhec3fnUPdeJpaHKcmU88NquM",
    }),
    AuthModule,
    PlatformModule,
    ProductsModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
