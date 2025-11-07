import { Controller, BadRequestException, Get, UseGuards } from "@nestjs/common"
import { DiscoverService } from "./discover.service"
import { AuthGuard } from "@/auth/auth.guard"

@Controller("discover")
export class DiscoverController {
  constructor(private readonly service: DiscoverService) {}

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
