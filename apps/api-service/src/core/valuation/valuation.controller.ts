import {
  Controller,
  BadRequestException,
  Get,
  UseGuards,
  Request,
} from "@nestjs/common"
import { ValuationService } from "./valuation.service"
import { statusMessages } from "@/shared/constants/status-messages"
import { TokenGuard } from "@/shared/auth/token.guard"
import { ModRequest } from "@/shared/auth/types/mod-request.interface"

@Controller("valuation")
export class ValuationController {
  constructor(private readonly service: ValuationService) {}

  @UseGuards(TokenGuard)
  @Get("wealth")
  async calculateTotalWealth(@Request() request: ModRequest) {
    try {
      const presentValuation = await this.service.calculateTotalWealth(
        request.user.userId
      )
      return { presentValuation }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }
}
