import {
  Controller,
  BadRequestException,
  Get,
  UseGuards,
  Post,
  Body,
} from "@nestjs/common"
import { FinNewsService } from "./finnews.service"
import { AuthGuard } from "@/auth/auth.guard"
import { statusMessages } from "@/shared/constants/status-messages"

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

  @UseGuards(AuthGuard)
  @Post("summarize")
  async summarize(@Body() summarizeDto: FinNewsSummarizerDto) {
    try {
      return await this.service.summarize(summarizeDto)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }
}
