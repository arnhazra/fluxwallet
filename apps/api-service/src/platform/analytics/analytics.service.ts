import { Injectable } from "@nestjs/common"
import { CreateAnalyticsDto } from "./dto/create-analytics.dto"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateAnalyticsCommand } from "./commands/impl/create-analytics.command"
import { Analytics } from "./schemas/analytics.schema"
import { GetAnalyticsQuery } from "./queries/impl/get-analytics-count.query"

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  createAnalytics(createAnalyticsDto: CreateAnalyticsDto) {
    try {
      this.commandBus.execute<CreateAnalyticsCommand, Analytics>(
        new CreateAnalyticsCommand(createAnalyticsDto)
      )
    } catch (error) {
      return false
    }
  }

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
