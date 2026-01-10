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
  /**
   * Accepts two screenshots (base, actual) as files from the frontend
   */
  @Post("upload")
  @UseInterceptors(AnyFilesInterceptor())
  async uploadScreenshots(@UploadedFiles() files: MulterFile[]) {
    // Expecting files with fieldnames 'base' and 'actual'
    const base = files.find((f) => f.fieldname === "base")
    const actual = files.find((f) => f.fieldname === "actual")
    if (!base || !actual) {
      throw new BadRequestException(
        "Both base and actual screenshots are required."
      )
    }
    // Here you can process, store, or analyze the files as needed
    // For now, just return their original names and mimetypes
    return {
      base: {
        originalname: base.originalname,
        mimetype: base.mimetype,
        size: base.size,
      },
      actual: {
        originalname: actual.originalname,
        mimetype: actual.mimetype,
        size: actual.size,
      },
    }
  }
}
