import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { GoalRepository } from "../../goal.repository"
import objectId from "@/shared/utils/convert-objectid"
import { UpdateGoalCommand } from "../impl/update-goal.command"

@CommandHandler(UpdateGoalCommand)
export class UpdateGoalCommandHandler
  implements ICommandHandler<UpdateGoalCommand>
{
  constructor(private readonly repository: GoalRepository) {}

  async execute(command: UpdateGoalCommand) {
    const { goalId, dto } = command
    return await this.repository.update(
      { _id: objectId(goalId) },
      {
        ...dto,
      }
    )
  }
}
