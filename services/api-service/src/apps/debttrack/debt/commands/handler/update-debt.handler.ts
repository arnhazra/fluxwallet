import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { DebtRepository } from "../../debt.repository"
import objectId from "@/shared/utils/convert-objectid"
import { UpdateDebtCommand } from "../impl/update-debt.command"

@CommandHandler(UpdateDebtCommand)
export class UpdateDebtCommandHandler
  implements ICommandHandler<UpdateDebtCommand>
{
  constructor(private readonly repository: DebtRepository) {}

  async execute(command: UpdateDebtCommand) {
    const { debtId, dto } = command
    return await this.repository.update(
      { _id: objectId(debtId) },
      {
        ...dto,
      }
    )
  }
}
