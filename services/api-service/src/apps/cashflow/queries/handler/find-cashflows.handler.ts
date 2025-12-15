import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindCashflowsQuery } from "../impl/find-cashflows.query"
import { CashFlowRepository } from "../../cashflow.repository"

@QueryHandler(FindCashflowsQuery)
export class FindCashflowsQueryHandler implements IQueryHandler<FindCashflowsQuery> {
  constructor(private readonly repository: CashFlowRepository) {}

  async execute(query: FindCashflowsQuery) {
    return this.repository.find()
  }
}
