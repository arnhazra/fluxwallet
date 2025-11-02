import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Space } from "./schemas/space.schema"
import { ProductsDbConnectionMap } from "@/shared/constants/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class SpaceRepository extends EntityRepository<Space> {
  constructor(
    @InjectModel(Space.name, ProductsDbConnectionMap.WealthAnalyzer)
    private spaceModel: Model<Space>
  ) {
    super(spaceModel)
  }
}
