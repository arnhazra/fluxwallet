import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindGoalByIdQuery } from "../impl/find-goal-by-id.query"
import { GoalRepository } from "../../goal.repository"
import objectId from "@/shared/utils/convert-objectid"

@QueryHandler(FindGoalByIdQuery)
export class FindGoalByIdQueryHandler
  implements IQueryHandler<FindGoalByIdQuery>
{
  constructor(private readonly repository: GoalRepository) {}

  async execute(query: FindGoalByIdQuery) {
    const { goalId, userId } = query
    return await this.repository.findOne({
      _id: objectId(goalId),
      userId: objectId(userId),
    })
  }
}
