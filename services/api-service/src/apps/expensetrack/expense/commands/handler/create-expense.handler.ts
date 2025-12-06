import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { CreateExpenseCommand } from "../impl/create-expense.command"
import { ExpenseRepository } from "../../expense.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@CommandHandler(CreateExpenseCommand)
export class CreateExpenseCommandHandler implements ICommandHandler<CreateExpenseCommand> {
  constructor(private readonly repository: ExpenseRepository) {}

  async execute(command: CreateExpenseCommand) {
    const { userId, dto } = command
    return await this.repository.create({
      userId: createOrConvertObjectId(userId),
      ...dto,
    })
  }
}
