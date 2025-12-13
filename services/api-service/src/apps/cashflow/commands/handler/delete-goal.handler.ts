import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { DeleteGoalCommand } from "../impl/delete-goal.command"
import { CashFlowRepository } from "../../cashflow.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@CommandHandler(DeleteGoalCommand)
export class DeleteGoalCommandHandler implements ICommandHandler<DeleteGoalCommand> {
  constructor(private readonly repository: CashFlowRepository) {}

  async execute(command: DeleteGoalCommand) {
    const { goalId } = command
    return await this.repository.delete({
      _id: createOrConvertObjectId(goalId),
    })
  }
}
