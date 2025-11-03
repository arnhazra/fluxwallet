import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import objectId from "@/shared/utils/convert-objectid"
import { AnalyticsRepository } from "../../analytics.repository"
import { CreateAnalyticsCommand } from "../impl/create-analytics.command"
import { Types } from "mongoose"

@CommandHandler(CreateAnalyticsCommand)
export class CreateAnalyticsCommandHandler
  implements ICommandHandler<CreateAnalyticsCommand>
{
  constructor(private readonly repository: AnalyticsRepository) {}

  async execute(command: CreateAnalyticsCommand) {
    const { createAnalyticsDto } = command
    const { userId, method, apiUri } = createAnalyticsDto
    return await this.repository.create({
      method,
      apiUri,
      userId: userId === null ? new Types.ObjectId() : objectId(userId),
    })
  }
}
