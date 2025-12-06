import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { ExpenseRepository } from "../../expense.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"
import { UpdateExpenseCommand } from "../impl/update-expense.command"

@CommandHandler(UpdateExpenseCommand)
export class UpdateExpenseCommandHandler implements ICommandHandler<UpdateExpenseCommand> {
  constructor(private readonly repository: ExpenseRepository) {}

  async execute(command: UpdateExpenseCommand) {
    const { expenseId, dto } = command
    return await this.repository.update(
      { _id: createOrConvertObjectId(expenseId) },
      {
        ...dto,
      }
    )
  }
}
