import { Controller, BadRequestException, Get, UseGuards } from "@nestjs/common"
import { FinanceNewsService } from "./financenews.service"
import { AuthGuard } from "@/auth/auth.guard"

@Controller("financenews")
export class FinanceNewsController {
  constructor(private readonly service: FinanceNewsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getNewsArticles() {
    try {
      return await this.service.getNewsArticles()
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
