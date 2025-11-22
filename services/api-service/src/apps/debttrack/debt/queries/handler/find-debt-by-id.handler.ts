import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindDebtByIdQuery } from "../impl/find-debt-by-id.query"
import { DebtRepository } from "../../debt.repository"
import objectId from "@/shared/utils/convert-objectid"

@QueryHandler(FindDebtByIdQuery)
export class FindDebtByIdQueryHandler
  implements IQueryHandler<FindDebtByIdQuery>
{
  constructor(private readonly repository: DebtRepository) {}

  async execute(query: FindDebtByIdQuery) {
    const { debtId, userId } = query
    return await this.repository.findOne({
      _id: objectId(debtId),
      userId: objectId(userId),
    })
  }
}
