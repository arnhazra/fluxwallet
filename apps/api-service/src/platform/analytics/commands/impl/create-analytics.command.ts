import { CreateAnalyticsDto } from "../../dto/create-analytics.dto"

export class CreateAnalyticsCommand {
  constructor(public readonly createAnalyticsDto: CreateAnalyticsDto) {}
}
