import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindCashflowsQuery } from "../impl/find-cashflows.query"
import { CashFlowRepository } from "../../cashflow.repository"
import { toDateOnlyUTC } from "../../helpers/to-date"

@QueryHandler(FindCashflowsQuery)
export class FindCashflowsQueryHandler implements IQueryHandler<FindCashflowsQuery> {
  constructor(private readonly repository: CashFlowRepository) {}

  async execute(_: FindCashflowsQuery) {
    const today = toDateOnlyUTC()

    return this.repository.find({
      nextExecutionAt: today,
    })
  }
}
