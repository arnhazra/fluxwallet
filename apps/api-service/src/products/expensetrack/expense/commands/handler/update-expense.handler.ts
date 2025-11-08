import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { ExpenseRepository } from "../../expense.repository"
import objectId from "@/shared/utils/convert-objectid"
import { UpdateExpenseCommand } from "../impl/update-expense.command"

@CommandHandler(UpdateExpenseCommand)
export class UpdateExpenseCommandHandler
  implements ICommandHandler<UpdateExpenseCommand>
{
  constructor(private readonly repository: ExpenseRepository) {}

  async execute(command: UpdateExpenseCommand) {
    const { expenseId, dto } = command
    return await this.repository.update(
      { _id: objectId(expenseId) },
      {
        ...dto,
      }
    )
  }
}
