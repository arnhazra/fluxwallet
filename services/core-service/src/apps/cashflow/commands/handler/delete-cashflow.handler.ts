import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { DeleteCashflowCommand } from "../impl/delete-cashflow.command"
import { CashFlowRepository } from "../../cashflow.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@CommandHandler(DeleteCashflowCommand)
export class DeleteCashflowCommandHandler implements ICommandHandler<DeleteCashflowCommand> {
  constructor(private readonly repository: CashFlowRepository) {}

  async execute(command: DeleteCashflowCommand) {
    const { cashflowId } = command
    return await this.repository.delete({
      _id: createOrConvertObjectId(cashflowId),
    })
  }
}
