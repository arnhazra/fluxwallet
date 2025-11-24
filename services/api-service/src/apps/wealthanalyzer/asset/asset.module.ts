import { Module } from "@nestjs/common"
import { AssetService } from "./asset.service"
import { AssetController } from "./asset.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { Asset, AssetSchema } from "./schemas/asset.schema"
import { AppsDbConnectionMap } from "@/shared/entity/entity-db-connection.map"
import { AssetRepository } from "./asset.repository"
import { CreateAssetCommandHandler } from "./commands/handler/create-asset.handler"
import { DeleteAssetCommandHandler } from "./commands/handler/delete-asset.handler"
import { FindAssetByIdQueryHandler } from "./queries/handler/find-asset-by-id.handler"
import { EntityModule } from "@/shared/entity/entity.module"
import { UpdateAssetCommandHandler } from "./commands/handler/update-asset.handler"
import { FindAssetsByUserQueryHandler } from "./queries/handler/find-assets-by-user.handler"
import { FindAssetsBySpaceQueryHandler } from "./queries/handler/find-assets-by-space.handler"

@Module({
  imports: [
    CqrsModule,
    EntityModule.forFeature(
      [{ name: Asset.name, schema: AssetSchema }],
      AppsDbConnectionMap.WealthAnalyzer
    ),
  ],
  controllers: [AssetController],
  providers: [
    AssetService,
    AssetRepository,
    CreateAssetCommandHandler,
    UpdateAssetCommandHandler,
    DeleteAssetCommandHandler,
    FindAssetsBySpaceQueryHandler,
    FindAssetsByUserQueryHandler,
    FindAssetByIdQueryHandler,
  ],
  exports: [AssetService],
})
export class AssetModule {}
