import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { CreateGoalCommand } from "../impl/create-goal.command"
import { GoalRepository } from "../../goal.repository"
import objectId from "@/shared/utils/convert-objectid"

@CommandHandler(CreateGoalCommand)
export class CreateGoalCommandHandler
  implements ICommandHandler<CreateGoalCommand>
{
  constructor(private readonly repository: GoalRepository) {}

  async execute(command: CreateGoalCommand) {
    const { userId, dto } = command
    return await this.repository.create({
      userId: objectId(userId),
      ...dto,
    })
  }
}
