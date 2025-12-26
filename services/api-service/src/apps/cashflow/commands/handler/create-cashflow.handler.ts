import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { CreateCashFlowCommand } from "../impl/create-cashflow.command"
import { CashFlowRepository } from "../../cashflow.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"
import { toDateOnlyUTC } from "../../helpers/to-date"

@CommandHandler(CreateCashFlowCommand)
export class CreateCashflowCommandHandler implements ICommandHandler<CreateCashFlowCommand> {
  constructor(private readonly repository: CashFlowRepository) {}

  async execute(command: CreateCashFlowCommand) {
    const {
      userId,
      dto: { targetAsset, nextExecutionAt, ...otherFields },
    } = command
    return await this.repository.create({
      userId: createOrConvertObjectId(userId),
      targetAsset: createOrConvertObjectId(targetAsset),
      nextExecutionAt: toDateOnlyUTC(nextExecutionAt),
      ...otherFields,
    })
  }
}
