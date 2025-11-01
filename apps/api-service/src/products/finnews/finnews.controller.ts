import { Controller, BadRequestException, Get, UseGuards } from "@nestjs/common"
import { FinNewsService } from "./finnews.service"
import { AuthGuard } from "@/auth/auth.guard"

@Controller("finnews")
export class FinNewsController {
  constructor(private readonly service: FinNewsService) {}

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
