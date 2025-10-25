import { Module } from "@nestjs/common"
import { FinNewsService } from "./finnews.service"
import { FinNewsController } from "./finnews.controller"
import { HttpModule } from "@nestjs/axios"
import { FinNewsStrategy } from "./finnews.strategy"

@Module({
  imports: [HttpModule],
  controllers: [FinNewsController],
  providers: [FinNewsService, FinNewsStrategy],
})
export class FinNewsModule {}
