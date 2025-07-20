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
  Put,
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
  @Get("/:portfolioId")
  async findPortfolioById(
    @Request() request: ModRequest,
    @Param() params: any
  ) {
    try {
      const portfolio = await this.service.findPortfolioById(
        request.user.userId,
        params.portfolioId
      )
      if (!portfolio) throw new Error()
      return portfolio
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @UseGuards(TokenGuard)
  @Put(":portfolioId")
  async updatePortfolioById(
    @Body() requestBody: CreatePortfolioRequestDto,
    @Param() params: any,
    @Request() request: ModRequest
  ) {
    try {
      return await this.service.updatePortfolioById(
        request.user.userId,
        params.portfolioId,
        requestBody
      )
    } catch (error) {
      throw error
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
