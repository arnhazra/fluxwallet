import { Injectable } from "@nestjs/common"
import { Goal } from "./schemas/goal.schema"
import { AppsDbConnectionMap } from "@/shared/constants/db-connection.map"
import {
  EntityModel,
  EntityRepository,
  InjectEntityModel,
} from "@/shared/entity/entity.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@Injectable()
export class GoalRepository extends EntityRepository<Goal> {
  constructor(
    @InjectEntityModel(Goal.name, AppsDbConnectionMap.WealthGoal)
    private goalModel: EntityModel<Goal>
  ) {
    super(goalModel)
  }

  async findNearestGoal(userId: string) {
    const today = new Date()

    return await this.goalModel
      .findOne({
        userId: createOrConvertObjectId(userId),
        goalDate: { $gte: today },
      })
      .sort({ goalDate: 1 })
      .exec()
  }
}
