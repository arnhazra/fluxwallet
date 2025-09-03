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
import { TaxAdvisorService } from "./taxadvisor.service"
import { AIGenerationDto } from "./dto/ai-generate.dto"
import { AuthGuard, ModRequest } from "@/auth/auth.guard"
import { statusMessages } from "@/shared/constants/status-messages"

@Controller("taxadvisor")
export class TaxAdvisorController {
  constructor(private readonly service: TaxAdvisorService) {}

  @UseGuards(AuthGuard)
  @Post()
  async generateRecommendation(
    @Request() request: ModRequest,
    @Body() aiGenerationDto: AIGenerationDto
  ) {
    try {
      return await this.service.generateRecommendation(
        aiGenerationDto,
        request.user.userId
      )
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Get(":threadId")
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
}
