import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
  BadRequestException,
} from "@nestjs/common"
import { IntelligenceService } from "./intelligence.service"
import { ChatDto } from "./dto/chat.dto"
import { AuthGuard, ModRequest } from "@/auth/auth.guard"
import { SummarizeDto } from "./dto/summarize.dto"
import { statusMessages } from "@/shared/constants/status-messages"

@Controller("intelligence")
export class IntelligenceController {
  constructor(private readonly service: IntelligenceService) {}

  @UseGuards(AuthGuard)
  @Post("chat")
  async chat(@Request() request: ModRequest, @Body() chatDto: ChatDto) {
    try {
      return await this.service.chat(chatDto, request.user.userId)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Get("thread/:threadId")
  async getThreadById(
    @Request() request: ModRequest,
    @Param("threadId") threadId: string
  ) {
    try {
      return await this.service.getThreadById(threadId, false)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Post("summarize")
  async summarize(
    @Request() request: ModRequest,
    @Body() summarizeDto: SummarizeDto
  ) {
    try {
      return await this.service.summarize(summarizeDto, request.user.userId)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }
}
