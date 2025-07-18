import {
  Controller,
  BadRequestException,
  Get,
  UseGuards,
  Request,
  Param,
} from "@nestjs/common"
import { ValuationService } from "./valuation.service"
import { statusMessages } from "@/shared/constants/status-messages"
import { TokenGuard } from "@/shared/auth/token.guard"
import { ModRequest } from "@/shared/auth/types/mod-request.interface"

@Controller("valuation")
export class ValuationController {
  constructor(private readonly service: ValuationService) {}

  @UseGuards(TokenGuard)
  @Get("asset/:assetId")
  async calculateCurrentValuationByAssetId(
    @Request() request: ModRequest,
    @Param() params: any
  ) {
    try {
      const presentValuation =
        await this.service.calculateCurrentValuationByAssetId(
          request.user.userId,
          params.assetId
        )
      return { presentValuation }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @UseGuards(TokenGuard)
  @Get("portfolio/:portfolioId")
  async calculatePortfolioValuation(
    @Request() request: ModRequest,
    @Param() params: any
  ) {
    try {
      const presentValuation = await this.service.calculatePortfolioValuation(
        request.user.userId,
        params.portfolioId
      )
      return { presentValuation }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @UseGuards(TokenGuard)
  @Get("total")
  async calculatTotalUserePortfolioValuation(@Request() request: ModRequest) {
    try {
      const presentValuation =
        await this.service.calculatTotalUserePortfolioValuation(
          request.user.userId
        )
      return { presentValuation }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }
}
