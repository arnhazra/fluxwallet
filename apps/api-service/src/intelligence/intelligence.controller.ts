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
import { AIGenerationDto } from "./dto/ai-generate.dto"
import { ModRequest } from "@/auth/types/mod-request.interface"
import { AuthGuard } from "@/auth/auth.guard"

@Controller("intelligence")
export class IntelligenceController {
  constructor(private readonly service: IntelligenceService) {}

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
      throw error
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
      throw error
    }
  }
}
