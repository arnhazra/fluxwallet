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
import { OneAgentService } from "./oneagent.service"
import { AIChatDto } from "./dto/ai-chat.dto"
import { AuthGuard, ModRequest } from "@/auth/auth.guard"
import { AISummarizeDto } from "./dto/ai-summarize.dto"
import { statusMessages } from "@/shared/constants/status-messages"

@Controller("oneagent")
export class OneAgentController {
  constructor(private readonly service: OneAgentService) {}

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
  @Post("chat")
  async chat(@Request() request: ModRequest, @Body() aiChatDto: AIChatDto) {
    try {
      return await this.service.chat(aiChatDto, request.user.userId)
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
    @Body() aiSummarizeDto: AISummarizeDto
  ) {
    try {
      return await this.service.summarize(aiSummarizeDto, request.user.userId)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }
}
