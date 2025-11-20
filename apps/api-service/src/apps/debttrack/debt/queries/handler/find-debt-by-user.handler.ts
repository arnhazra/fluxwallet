import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindDebtsByUserQuery } from "../impl/find-debt-by-user.query"
import { DebtRepository } from "../../debt.repository"
import objectId from "@/shared/utils/convert-objectid"
import { FilterQuery } from "mongoose"
import { Debt } from "../../schemas/debt.schema"

@QueryHandler(FindDebtsByUserQuery)
export class FindDebtsByUserQueryHandler
  implements IQueryHandler<FindDebtsByUserQuery>
{
  constructor(private readonly repository: DebtRepository) {}

  async execute(query: FindDebtsByUserQuery) {
    const { userId, searchKeyword } = query

    const filter: FilterQuery<Debt> = {
      userId: objectId(userId),
    }

    if (searchKeyword && searchKeyword.trim().length > 0) {
      filter.debtPurpose = { $regex: new RegExp(searchKeyword, "i") }
    }

    return await this.repository.find(filter)
  }
}
