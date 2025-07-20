import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { PortfolioRepository } from "../../portfolio.repository"
import objectId from "@/shared/utils/convert-objectid"
import { UpdatePortfolioCommand } from "../impl/update-portfolio.command"

@CommandHandler(UpdatePortfolioCommand)
export class UpdatePortfolioCommandHandler
  implements ICommandHandler<UpdatePortfolioCommand>
{
  constructor(private readonly repository: PortfolioRepository) {}

  async execute(command: UpdatePortfolioCommand) {
    const {
      portfolioId,
      dto: { institutionType, portfolioName },
    } = command
    return await this.repository.update(
      { _id: objectId(portfolioId) },
      {
        institutionType,
        portfolioName,
      }
    )
  }
}
