import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindAllPortfolioQuery } from "../impl/find-all-portfolios.query"
import { PortfolioRepository } from "../../portfolio.repository"
import objectId from "@/shared/utils/convert-objectid"

@QueryHandler(FindAllPortfolioQuery)
export class FindAllPortfolioQueryHandler
  implements IQueryHandler<FindAllPortfolioQuery>
{
  constructor(private readonly repository: PortfolioRepository) {}

  async execute(query: FindAllPortfolioQuery) {
    const { userId } = query
    return await this.repository.find({
      userId: objectId(userId),
    })
  }
}
