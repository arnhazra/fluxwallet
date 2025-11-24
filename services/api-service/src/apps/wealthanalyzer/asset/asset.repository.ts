import { Injectable } from "@nestjs/common"
import { Asset } from "./schemas/asset.schema"
import { AppsDbConnectionMap } from "@/shared/constants/db-connection.map"
import {
  EntityModel,
  EntityRepository,
  InjectEntityModel,
} from "@/shared/entity/entity.repository"

@Injectable()
export class AssetRepository extends EntityRepository<Asset> {
  constructor(
    @InjectEntityModel(Asset.name, AppsDbConnectionMap.WealthAnalyzer)
    private assetModel: EntityModel<Asset>
  ) {
    super(assetModel)
  }
}
