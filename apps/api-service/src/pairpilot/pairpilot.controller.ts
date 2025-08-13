import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
} from "@nestjs/common"
import { PairPilotService } from "./pairpilot.service"
import { AIGenerationDto } from "./dto/ai-generate.dto"
import { ModRequest } from "src/shared/auth/types/mod-request.interface"
import { AuthGuard } from "@/shared/auth/auth.guard"

@Controller("pairpilot")
export class PairPilotController {
  constructor(private readonly service: PairPilotService) {}

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
