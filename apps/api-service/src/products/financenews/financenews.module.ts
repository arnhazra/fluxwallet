import { Module } from "@nestjs/common"
import { FinanceNewsService } from "./financenews.service"
import { FinanceNewsController } from "./financenews.controller"
import { HttpModule } from "@nestjs/axios"

@Module({
  imports: [HttpModule],
  controllers: [FinanceNewsController],
  providers: [FinanceNewsService],
})
export class FinanceNewsModule {}
