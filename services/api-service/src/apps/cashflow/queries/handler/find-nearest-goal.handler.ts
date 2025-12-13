import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindNearestGoalQuery } from "../impl/find-nearest-goal.query"
import { CashFlowRepository } from "../../cashflow.repository"

@QueryHandler(FindNearestGoalQuery)
export class FindNearestGoalQueryHandler implements IQueryHandler<FindNearestGoalQuery> {
  constructor(private readonly repository: CashFlowRepository) {}

  async execute(query: FindNearestGoalQuery) {
    const { userId } = query
    return await this.repository.findNearestGoal(userId)
  }
}
