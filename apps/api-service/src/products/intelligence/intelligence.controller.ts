import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
} from "@nestjs/common"
import { IntelligenceService } from "./intelligence.service"
import { AIChatDto } from "./dto/ai-chat.dto"
import { AuthGuard, ModRequest } from "@/auth/auth.guard"
import { AISummarizeDto } from "./dto/ai-summarize.dto"

@Controller("intelligence")
export class IntelligenceController {
  constructor(private readonly service: IntelligenceService) {}

  @UseGuards(AuthGuard)
  @Get("thread/:threadId")
  async getThreadById(
    @Request() request: ModRequest,
    @Param("threadId") threadId: string
  ) {
    try {
      return await this.service.getThreadById(threadId, false)
    } catch (error) {
      throw error
    }
  }

  @UseGuards(AuthGuard)
  @Post("chat")
  async chat(@Request() request: ModRequest, @Body() aiChatDto: AIChatDto) {
    try {
      return await this.service.chat(aiChatDto, request.user.userId)
    } catch (error) {
      throw error
    }
  }

  @UseGuards(AuthGuard)
  @Post("summarize")
  async summarize(
    @Request() request: ModRequest,
    @Body() aiSummarizeDto: AISummarizeDto
  ) {
    try {
      return await this.service.summarize(aiSummarizeDto, request.user.userId)
    } catch (error) {
      throw error
    }
  }
}
