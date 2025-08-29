import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Goal } from "./schemas/goal.schema"
import { ProductsDbConnectionMap } from "src/shared/utils/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class GoalRepository extends EntityRepository<Goal> {
  constructor(
    @InjectModel(Goal.name, ProductsDbConnectionMap.WealthGoal)
    private goalModel: Model<Goal>
  ) {
    super(goalModel)
  }
}
