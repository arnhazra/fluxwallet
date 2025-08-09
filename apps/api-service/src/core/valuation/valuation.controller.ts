import {
  Controller,
  BadRequestException,
  Get,
  UseGuards,
  Request,
} from "@nestjs/common"
import { ValuationService } from "./valuation.service"
import { statusMessages } from "@/shared/constants/status-messages"
import { AuthGuard } from "@/shared/auth/auth.guard"
import { ModRequest } from "@/shared/auth/types/mod-request.interface"

@Controller("valuation")
export class ValuationController {
  constructor(private readonly service: ValuationService) {}

  @UseGuards(AuthGuard)
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
