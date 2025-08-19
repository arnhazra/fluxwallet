import { Module } from "@nestjs/common"
import { ValuationService } from "./valuation.service"
import { ValuationController } from "./valuation.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { Asset, AssetSchema } from "../asset/schemas/asset.schema"
import { ProductsDbConnectionMap } from "src/shared/utils/db-connection.map"
import { ValuationRepository } from "./valuation.repository"
import { EntityModule } from "@/shared/entity/entity.module"

@Module({
  imports: [
    CqrsModule,
    EntityModule.forFeature(
      [{ name: Asset.name, schema: AssetSchema }],
      ProductsDbConnectionMap.AssetManager
    ),
  ],
  controllers: [ValuationController],
  providers: [ValuationService, ValuationRepository],
  exports: [ValuationService],
})
export class ValuationModule {}
