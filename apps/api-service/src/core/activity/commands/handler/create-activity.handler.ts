import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import objectId from "@/shared/utils/convert-objectid"
import { ActivityRepository } from "../../activity.repository"
import { CreateActivityCommand } from "../impl/create-activity.command"

@CommandHandler(CreateActivityCommand)
export class CreateActivityCommandHandler
  implements ICommandHandler<CreateActivityCommand>
{
  constructor(private readonly repository: ActivityRepository) {}

  async execute(command: CreateActivityCommand) {
    const { createActivityDto } = command
    const { userId, method, apiUri } = createActivityDto
    return await this.repository.create({
      method,
      apiUri,
      userId: objectId(userId),
    })
  }
}
