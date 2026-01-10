import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
  BadRequestException,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common"
import { AnyFilesInterceptor } from "@nestjs/platform-express"
type MulterFile = Express.Multer.File
import { TaxAdvisorService } from "./sscompare.service"
import { AIGenerationDto } from "./dto/ai-generate.dto"
import { AuthGuard, ModRequest } from "@/auth/auth.guard"
import { statusMessages } from "@/shared/constants/status-messages"

@Controller("sscompare")
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

  @Post("upload")
  @UseInterceptors(AnyFilesInterceptor())
  async uploadScreenshots(@UploadedFiles() files: MulterFile[]) {
    const base = files.find((f) => f.fieldname === "base")
    const actual = files.find((f) => f.fieldname === "actual")
    if (!base || !actual) {
      throw new BadRequestException(
        "Both base and actual screenshots are required."
      )
    }
    return await this.service.compareScreenshots(base, actual)
  }
}
