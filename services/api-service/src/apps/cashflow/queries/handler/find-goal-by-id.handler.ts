import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindGoalByIdQuery } from "../impl/find-goal-by-id.query"
import { CashFlowRepository } from "../../cashflow.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@QueryHandler(FindGoalByIdQuery)
export class FindGoalByIdQueryHandler implements IQueryHandler<FindGoalByIdQuery> {
  constructor(private readonly repository: CashFlowRepository) {}

  async execute(query: FindGoalByIdQuery) {
    const { goalId, userId } = query
    return await this.repository.findOne({
      _id: createOrConvertObjectId(goalId),
      userId: createOrConvertObjectId(userId),
    })
  }
}
