import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
} from "@nestjs/common"
import { AdvisorXService } from "./advisorx.service"
import { AIGenerationDto } from "./dto/ai-generate.dto"
import { AuthGuard, ModRequest } from "@/auth/auth.guard"

@Controller("advisorx")
export class AdvisorXController {
  constructor(private readonly service: AdvisorXService) {}

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
