import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Asset } from "./schemas/asset.schema"
import { ProductsDbConnectionMap } from "src/shared/utils/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class AssetRepository extends EntityRepository<Asset> {
  constructor(
    @InjectModel(Asset.name, ProductsDbConnectionMap.AssetManager)
    private assetModel: Model<Asset>
  ) {
    super(assetModel)
  }
}
