import {
  Controller,
  Post,
  BadRequestException,
  Get,
  Delete,
  UseGuards,
  Request,
  Param,
  Body,
  Query,
} from "@nestjs/common"
import { PortfolioService } from "./portfolio.service"
import { statusMessages } from "@/shared/constants/status-messages"
import { TokenGuard } from "@/shared/auth/token.guard"
import { ModRequest } from "@/shared/auth/types/mod-request.interface"
import { CreatePortfolioRequestDto } from "./dto/request/create-portfolio.request.dto"

@Controller("portfolio")
export class PortfolioController {
  constructor(private readonly service: PortfolioService) {}

  @UseGuards(TokenGuard)
  @Post()
  async createPortfolio(
    @Body() requestBody: CreatePortfolioRequestDto,
    @Request() request: ModRequest
  ) {
    try {
      return await this.service.createPortfolio(
        request.user.userId,
        requestBody
      )
    } catch (error) {
      throw error
    }
  }

  @UseGuards(TokenGuard)
  @Get()
  async findMyPortfolios(@Request() request: ModRequest) {
    try {
      return await this.service.findMyPortfolios(request.user.userId)
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @UseGuards(TokenGuard)
  @Get(":id")
  async findPortfolioById(
    @Request() request: ModRequest,
    @Param() params: any
  ) {
    try {
      return await this.service.findPortfolioById(
        request.user.userId,
        params.portfolioId
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @UseGuards(TokenGuard)
  @Delete("/:portfolioId")
  async deletePortfolio(@Request() request: ModRequest, @Param() params: any) {
    try {
      return await this.service.deletePortfolio(
        request.user.userId,
        params.portfolioId
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }
}
