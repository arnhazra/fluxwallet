import { Module } from "@nestjs/common"
import { AssetService } from "./asset.service"
import { AssetController } from "./asset.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { Asset, AssetSchema } from "./schemas/asset.schema"
import { ProductsDbConnectionMap } from "src/shared/utils/db-connection.map"
import { AssetRepository } from "./asset.repository"
import { CreateAssetCommandHandler } from "./commands/handler/create-asset.handler"
import { DeleteAssetCommandHandler } from "./commands/handler/delete-asset.handler"
import { FindAssetsByInstitutionQueryHandler } from "./queries/handler/find-assets-by-institution.handler"
import { FindAssetByIdQueryHandler } from "./queries/handler/find-asset-by-id.handler"
import { EntityModule } from "@/shared/entity/entity.module"
import { UpdateAssetCommandHandler } from "./commands/handler/update-asset.handler"
import { ValuationModule } from "../valuation/valuation.module"
import { FindAssetsByUserQueryHandler } from "./queries/handler/find-assets-by-user.handler"

@Module({
  imports: [
    CqrsModule,
    ValuationModule,
    EntityModule.forFeatureAsync(
      [{ name: Asset.name, schema: AssetSchema }],
      ProductsDbConnectionMap.WealthAnalyzer
    ),
  ],
  controllers: [AssetController],
  providers: [
    AssetService,
    AssetRepository,
    CreateAssetCommandHandler,
    UpdateAssetCommandHandler,
    DeleteAssetCommandHandler,
    FindAssetsByInstitutionQueryHandler,
    FindAssetsByUserQueryHandler,
    FindAssetByIdQueryHandler,
  ],
})
export class AssetModule {}
