import { Controller, BadRequestException, Get, UseGuards } from "@nestjs/common"
import { NewsService } from "./news.service"
import { AuthGuard } from "@/auth/auth.guard"

@Controller("products/discover/news")
export class NewsController {
  constructor(private readonly service: NewsService) {}

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
