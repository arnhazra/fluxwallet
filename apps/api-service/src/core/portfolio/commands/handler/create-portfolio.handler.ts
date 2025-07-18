import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { CreatePortfolioCommand } from "../impl/create-portfolio.command"
import { PortfolioRepository } from "../../portfolio.repository"
import objectId from "@/shared/utils/convert-objectid"

@CommandHandler(CreatePortfolioCommand)
export class CreatePortfolioCommandHandler
  implements ICommandHandler<CreatePortfolioCommand>
{
  constructor(private readonly repository: PortfolioRepository) {}

  async execute(command: CreatePortfolioCommand) {
    const {
      userId,
      dto: { baseCurrency, institutionType, portfolioName },
    } = command
    return await this.repository.create({
      userId: objectId(userId),
      baseCurrency,
      institutionType,
      portfolioName,
    })
  }
}
