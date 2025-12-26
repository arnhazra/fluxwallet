import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { CreateDebtCommand } from "../impl/create-debt.command"
import { DebtRepository } from "../../debt.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@CommandHandler(CreateDebtCommand)
export class CreateDebtCommandHandler implements ICommandHandler<CreateDebtCommand> {
  constructor(private readonly repository: DebtRepository) {}

  async execute(command: CreateDebtCommand) {
    const { userId, dto } = command
    return await this.repository.create({
      userId: createOrConvertObjectId(userId),
      ...dto,
    })
  }
}
