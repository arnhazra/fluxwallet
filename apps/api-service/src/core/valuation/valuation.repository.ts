import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { DbConnectionMap } from "src/shared/utils/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"
import { Asset } from "../asset/schemas/asset.schema"

@Injectable()
export class ValuationRepository extends EntityRepository<Asset> {
  constructor(
    @InjectModel(Asset.name, DbConnectionMap.Primary)
    private assetModel: Model<Asset>
  ) {
    super(assetModel)
  }
}
