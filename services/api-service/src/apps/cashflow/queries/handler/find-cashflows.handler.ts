import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindCashflowsQuery } from "../impl/find-cashflows.query"
import { CashFlowRepository } from "../../cashflow.repository"

@QueryHandler(FindCashflowsQuery)
export class FindCashflowsQueryHandler implements IQueryHandler<FindCashflowsQuery> {
  constructor(private readonly repository: CashFlowRepository) {}

  async execute(query: FindCashflowsQuery) {
    const now = new Date()

    const start = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        12,
        0,
        0,
        0
      )
    )

    const end = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        12,
        0,
        0,
        0
      )
    )

    return this.repository.find({
      nextExecutionAt: { $gte: start, $lt: end },
    })
  }
}
