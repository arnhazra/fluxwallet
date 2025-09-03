import {
  Controller,
  Post,
  Get,
  Query,
  Res,
  UseGuards,
  Request,
  BadRequestException,
} from "@nestjs/common"
import { SubscriptionService } from "./subscription.service"
import { AuthGuard, ModRequest } from "@/auth/auth.guard"
import { getRediretURIUI } from "./utils/redirect-uri"
import { statusMessages } from "@/shared/constants/status-messages"

@Controller("subscription")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(AuthGuard)
  @Post("checkout")
  async createCheckoutSession(@Request() request: ModRequest) {
    try {
      const session = await this.subscriptionService.createCheckoutSession(
        request.user.userId
      )
      return { redirectUrl: session.url }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @Get("subscribe")
  async handleSubscribe(
    @Query("session_id") sessionId: string,
    @Res() res: any
  ) {
    if (!sessionId) {
      res.redirect(getRediretURIUI(false))
    } else {
      try {
        await this.subscriptionService.handleSubscribe(sessionId)
        res.redirect(getRediretURIUI(true))
      } catch (error) {
        res.redirect(getRediretURIUI(false))
      }
    }
  }

  @Get("cancel")
  handleCancel(@Res() res: any) {
    res.redirect(getRediretURIUI(false))
  }
}
