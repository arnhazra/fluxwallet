import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { PortfolioRepository } from "../../portfolio.repository"
import objectId from "src/shared/utils/convert-objectid"
import { FindPortfolioByNameQuery } from "../impl/find-portfolio-by-name.query"

@QueryHandler(FindPortfolioByNameQuery)
export class FindPortfolioByNameQueryHandler
  implements IQueryHandler<FindPortfolioByNameQuery>
{
  constructor(private readonly repository: PortfolioRepository) {}

  async execute(query: FindPortfolioByNameQuery) {
    const { portfolioName, userId } = query
    return await this.repository.findOne({
      portfolioName: { $regex: new RegExp(portfolioName, "i") },
      userId: objectId(userId),
    })
  }
}
