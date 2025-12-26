import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindNearestGoalQuery } from "../impl/find-nearest-goal.query"
import { GoalRepository } from "../../goal.repository"

@QueryHandler(FindNearestGoalQuery)
export class FindNearestGoalQueryHandler implements IQueryHandler<FindNearestGoalQuery> {
  constructor(private readonly repository: GoalRepository) {}

  async execute(query: FindNearestGoalQuery) {
    const { userId } = query
    return await this.repository.findNearestGoal(userId)
  }
}
