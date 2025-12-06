import { Injectable } from "@nestjs/common"
import { CreateAnalyticsDto } from "./dto/create-analytics.dto"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateAnalyticsCommand } from "./commands/impl/create-analytics.command"
import { Analytics } from "./schemas/analytics.schema"
import { GetAnalyticsQuery } from "./queries/impl/get-analytics-count.query"
import { OnEvent } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/constants/event.map"

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @OnEvent(EventMap.CreateAnalytics)
  createAnalytics(createAnalyticsDto: CreateAnalyticsDto) {
    try {
      this.commandBus.execute<CreateAnalyticsCommand, Analytics>(
        new CreateAnalyticsCommand(createAnalyticsDto)
      )
    } catch (error) {
      return false
    }
  }

  @OnEvent(EventMap.GetAnalyticsTrend)
  async getAnalyticsCount(searchKeyword: string) {
    try {
      return this.queryBus.execute<GetAnalyticsQuery, { totalUsage: number }>(
        new GetAnalyticsQuery({ searchKeyword })
      )
    } catch (error) {
      throw error
    }
  }
}
