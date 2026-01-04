import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindCashflowsQuery } from "../impl/find-cashflows.query"
import { CashFlowRepository } from "../../cashflow.repository"
import { format } from "date-fns"

@QueryHandler(FindCashflowsQuery)
export class FindCashflowsQueryHandler implements IQueryHandler<FindCashflowsQuery> {
  constructor(private readonly repository: CashFlowRepository) {}

  async execute(_: FindCashflowsQuery) {
    const today = format(new Date(), "yyyy-MM-dd")

    return this.repository.find({
      nextExecutionAt: today,
    })
  }
}
