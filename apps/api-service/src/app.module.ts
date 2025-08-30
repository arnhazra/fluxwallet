import { Module } from "@nestjs/common"
import { PlatformModule } from "./platform/platform.module"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { AppController } from "./app.controller"
import { AuthModule } from "./auth/auth.module"
import { ProductsModule } from "./products/products.module"
import { SharedModule } from "./shared/shared.module"

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    AuthModule,
    PlatformModule,
    ProductsModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
