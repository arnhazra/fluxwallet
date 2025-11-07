import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { DeleteExpenseCommand } from "../impl/delete-expense.command"
import { ExpenseRepository } from "../../expense.repository"
import objectId from "@/shared/utils/convert-objectid"

@CommandHandler(DeleteExpenseCommand)
export class DeleteExpenseCommandHandler
  implements ICommandHandler<DeleteExpenseCommand>
{
  constructor(private readonly repository: ExpenseRepository) {}

  async execute(command: DeleteExpenseCommand) {
    const { expenseId } = command
    return await this.repository.delete({ _id: objectId(expenseId) })
  }
}
