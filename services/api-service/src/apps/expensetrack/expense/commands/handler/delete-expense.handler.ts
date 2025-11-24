import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { DeleteExpenseCommand } from "../impl/delete-expense.command"
import { ExpenseRepository } from "../../expense.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@CommandHandler(DeleteExpenseCommand)
export class DeleteExpenseCommandHandler
  implements ICommandHandler<DeleteExpenseCommand>
{
  constructor(private readonly repository: ExpenseRepository) {}

  async execute(command: DeleteExpenseCommand) {
    const { expenseId } = command
    return await this.repository.delete({
      _id: createOrConvertObjectId(expenseId),
    })
  }
}
