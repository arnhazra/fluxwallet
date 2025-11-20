import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Goal } from "./schemas/goal.schema"
import { AppsDbConnectionMap } from "@/shared/constants/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"
import objectId from "@/shared/utils/convert-objectid"

@Injectable()
export class GoalRepository extends EntityRepository<Goal> {
  constructor(
    @InjectModel(Goal.name, AppsDbConnectionMap.WealthGoal)
    private goalModel: Model<Goal>
  ) {
    super(goalModel)
  }

  async findNearestGoal(userId: string) {
    const today = new Date()

    return await this.goalModel
      .findOne({
        userId: objectId(userId),
        goalDate: { $gte: today },
      })
      .sort({ goalDate: 1 })
      .exec()
  }
}
