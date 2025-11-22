import { Controller, BadRequestException } from "@nestjs/common"
import { AnalyticsService } from "./analytics.service"
import { CreateAnalyticsDto } from "./dto/create-analytics.dto"
import { EventMap } from "../../shared/constants/event.map"
import { OnEvent } from "@nestjs/event-emitter"
import { statusMessages } from "@/shared/constants/status-messages"

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @OnEvent(EventMap.CreateAnalytics)
  createAnalytics(createAnalyticsDto: CreateAnalyticsDto) {
    this.analyticsService.createAnalytics(createAnalyticsDto)
  }

  @OnEvent(EventMap.GetAnalyticsTrend)
  async getAnalyticsCount(searchKeyword: string) {
    try {
      return await this.analyticsService.getAnalyticsCount(searchKeyword)
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }
}
