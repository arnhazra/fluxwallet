import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Solution } from "./schemas/solution.schema"
import { GeneralDbConnectionMap } from "src/shared/utils/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class SolutionRepository extends EntityRepository<Solution> {
  constructor(
    @InjectModel(Solution.name, GeneralDbConnectionMap.Core)
    private solutionModel: Model<Solution>
  ) {
    super(solutionModel)
  }
}
