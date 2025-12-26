import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindCashflowsByUserQuery } from "../impl/find-cashflows-by-user.query"
import { CashFlowRepository } from "../../cashflow.repository"
import {
  createOrConvertObjectId,
  QueryFilter,
} from "@/shared/entity/entity.schema"
import { Cashflow } from "../../schemas/cashflow.schema"

@QueryHandler(FindCashflowsByUserQuery)
export class FindCashflowsByUserQueryHandler implements IQueryHandler<FindCashflowsByUserQuery> {
  constructor(private readonly repository: CashFlowRepository) {}

  async execute(query: FindCashflowsByUserQuery) {
    const { userId, searchKeyword } = query

    const filter: QueryFilter<Cashflow> = {
      userId: createOrConvertObjectId(userId),
    }

    if (searchKeyword && searchKeyword.trim().length > 0) {
      filter.description = { $regex: new RegExp(searchKeyword, "i") }
    }

    return this.repository.find(filter)
  }
}
