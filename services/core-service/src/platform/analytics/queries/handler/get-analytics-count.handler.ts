import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetAnalyticsQuery } from "../impl/get-analytics-count.query"
import { AnalyticsRepository } from "../../analytics.repository"

@QueryHandler(GetAnalyticsQuery)
export class GetAnalyticsQueryHandler implements IQueryHandler<GetAnalyticsQuery> {
  constructor(private readonly repository: AnalyticsRepository) {}

  async execute(query: GetAnalyticsQuery) {
    const { searchKeyword } = query.getCountDto
    const regex = new RegExp(searchKeyword, "i")
    const totalUsage = await this.repository.countDocuments({
      apiUri: { $regex: regex },
    })
    return { totalUsage }
  }
}
