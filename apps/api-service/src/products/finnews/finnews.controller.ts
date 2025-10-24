import { Controller, BadRequestException, Get } from "@nestjs/common"
import { FinNewsService } from "./finnews.service"

@Controller("finnews")
export class FinNewsController {
  constructor(private readonly service: FinNewsService) {}

  @Get()
  async getNewsArticles() {
    try {
      return await this.service.getNewsArticles()
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
