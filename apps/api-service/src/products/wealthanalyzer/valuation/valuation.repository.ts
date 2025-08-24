import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { ProductsDbConnectionMap } from "src/shared/utils/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"
import { Asset } from "../asset/schemas/asset.schema"

@Injectable()
export class ValuationRepository extends EntityRepository<Asset> {
  constructor(
    @InjectModel(Asset.name, ProductsDbConnectionMap.WealthAnalyzer)
    private assetModel: Model<Asset>
  ) {
    super(assetModel)
  }
}
