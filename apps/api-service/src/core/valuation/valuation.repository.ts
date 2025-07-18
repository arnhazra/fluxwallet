import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Asset } from "./schemas/asset.schema"
import { DbConnectionMap } from "src/shared/utils/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class ValuationRepository extends EntityRepository<Asset> {
  constructor(
    @InjectModel(Asset.name, DbConnectionMap.Primary)
    private assetModel: Model<Asset>
  ) {
    super(assetModel)
  }
}
