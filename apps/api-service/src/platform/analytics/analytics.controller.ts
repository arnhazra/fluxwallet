import {
  Controller,
  Post,
  BadRequestException,
  Body,
  UseGuards,
} from "@nestjs/common"
import { AnalyticsService } from "./analytics.service"
import { CreateAnalyticsDto } from "./dto/create-analytics.dto"
import { EventMap } from "../../shared/constants/event.map"
import { OnEvent } from "@nestjs/event-emitter"
import { GetCountDto } from "./dto/get-count.dto"
import { AuthGuard } from "@/auth/auth.guard"
import { statusMessages } from "@/shared/constants/status-messages"

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @OnEvent(EventMap.CreateAnalytics)
  createAnalytics(createAnalyticsDto: CreateAnalyticsDto) {
    this.analyticsService.createAnalytics(createAnalyticsDto)
  }

  @UseGuards(AuthGuard)
  @Post("trends")
  async getAnalyticsCount(@Body() getCountDto: GetCountDto) {
    try {
      return await this.analyticsService.getAnalyticsCount(getCountDto)
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }
}
