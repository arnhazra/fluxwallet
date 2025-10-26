import { Module } from "@nestjs/common"
import { FinNewsService } from "./finnews.service"
import { FinNewsController } from "./finnews.controller"
import { HttpModule } from "@nestjs/axios"

@Module({
  imports: [HttpModule],
  controllers: [FinNewsController],
  providers: [FinNewsService],
})
export class FinNewsModule {}
