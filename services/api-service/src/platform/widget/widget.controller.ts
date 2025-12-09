import {
  Controller,
  BadRequestException,
  Get,
  UseGuards,
  Request,
} from "@nestjs/common"
import { WidgetService } from "./widget.service"
import { statusMessages } from "@/shared/constants/status-messages"
import { AuthGuard, ModRequest } from "@/auth/auth.guard"

@Controller("platform/widgets")
export class WidgetController {
  constructor(private readonly service: WidgetService) {}

  @Get("")
  @UseGuards(AuthGuard)
  async getWidgets(@Request() request: ModRequest) {
    try {
      return await this.service.getWidgets(request.user.userId)
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }
}
