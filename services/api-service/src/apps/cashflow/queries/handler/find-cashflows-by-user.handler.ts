import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindCashflowsByUserQuery } from "../impl/find-cashflows-by-user.query"
import { CashFlowRepository } from "../../cashflow.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@QueryHandler(FindCashflowsByUserQuery)
export class FindCashflowsByUserQueryHandler implements IQueryHandler<FindCashflowsByUserQuery> {
  constructor(private readonly repository: CashFlowRepository) {}

  async execute(query: FindCashflowsByUserQuery) {
    const { userId } = query

    return this.repository.find({
      userId: createOrConvertObjectId(userId),
    })
  }
}
