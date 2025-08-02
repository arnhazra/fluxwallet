import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindPortfolioByIdQuery } from "../impl/find-portfolio-by-id.query"
import { PortfolioRepository } from "../../portfolio.repository"
import objectId from "@/shared/utils/convert-objectid"

@QueryHandler(FindPortfolioByIdQuery)
export class FindPortfolioByIdQueryHandler
  implements IQueryHandler<FindPortfolioByIdQuery>
{
  constructor(private readonly repository: PortfolioRepository) {}

  async execute(query: FindPortfolioByIdQuery) {
    const { portfolioId, userId } = query
    return await this.repository.findOne({
      _id: objectId(portfolioId),
      userId: objectId(userId),
    })
  }
}
