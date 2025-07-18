import { Module } from "@nestjs/common"
import { ValuationService } from "./valuation.service"
import { ValuationController } from "./valuation.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { Asset, AssetSchema } from "./schemas/asset.schema"
import { DbConnectionMap } from "src/shared/utils/db-connection.map"
import { ValuationRepository } from "./valuation.repository"
import { FindAssetByIdQueryHandler } from "./queries/handler/find-asset-by-id.handler"
import { EntityModule } from "@/shared/entity/entity.module"

@Module({
  imports: [
    CqrsModule,
    EntityModule.forFeature(
      [{ name: Asset.name, schema: AssetSchema }],
      DbConnectionMap.Primary
    ),
  ],
  controllers: [ValuationController],
  providers: [ValuationService, ValuationRepository, FindAssetByIdQueryHandler],
})
export class ValuationModule {}
