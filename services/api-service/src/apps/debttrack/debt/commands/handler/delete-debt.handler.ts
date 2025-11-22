import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { DeleteDebtCommand } from "../impl/delete-debt.command"
import { DebtRepository } from "../../debt.repository"
import objectId from "@/shared/utils/convert-objectid"

@CommandHandler(DeleteDebtCommand)
export class DeleteDebtCommandHandler
  implements ICommandHandler<DeleteDebtCommand>
{
  constructor(private readonly repository: DebtRepository) {}

  async execute(command: DeleteDebtCommand) {
    const { debtId } = command
    return await this.repository.delete({ _id: objectId(debtId) })
  }
}
