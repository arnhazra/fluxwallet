import { Module } from "@nestjs/common"
import { ConfigService } from "./config.service"
import { ConfigController } from "./config.controller"
import { CqrsModule } from "@nestjs/cqrs"

@Module({
  imports: [CqrsModule],
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class ConfigModule {}
