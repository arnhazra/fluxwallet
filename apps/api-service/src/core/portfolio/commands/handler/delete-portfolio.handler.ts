import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { DeletePortfolioCommand } from "../impl/delete-portfolio.command"
import { PortfolioRepository } from "../../portfolio.repository"
import objectId from "src/shared/utils/convert-objectid"

@CommandHandler(DeletePortfolioCommand)
export class DeletePortfolioCommandHandler
  implements ICommandHandler<DeletePortfolioCommand>
{
  constructor(private readonly repository: PortfolioRepository) {}

  async execute(command: DeletePortfolioCommand) {
    const { portfolioId } = command
    return await this.repository.delete({ _id: objectId(portfolioId) })
  }
}
