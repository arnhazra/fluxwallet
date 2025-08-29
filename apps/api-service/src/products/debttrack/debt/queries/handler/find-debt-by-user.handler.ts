import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindDebtsByUserQuery } from "../impl/find-debt-by-user.query"
import { DebtRepository } from "../../debt.repository"
import objectId from "@/shared/utils/convert-objectid"

@QueryHandler(FindDebtsByUserQuery)
export class FindDebtsByUserQueryHandler
  implements IQueryHandler<FindDebtsByUserQuery>
{
  constructor(private readonly repository: DebtRepository) {}

  async execute(query: FindDebtsByUserQuery) {
    const { userId } = query
    return await this.repository.find({
      userId: objectId(userId),
    })
  }
}
