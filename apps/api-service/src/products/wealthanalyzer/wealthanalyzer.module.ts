import { Module } from "@nestjs/common"
import { AssetModule } from "./asset/asset.module"
import { InstitutionModule } from "./institution/institution.module"
import { EntityModule } from "@/shared/entity/entity.module"
import { config } from "@/config"
import { ProductsDbConnectionMap } from "@/shared/utils/db-connection.map"

@Module({
  imports: [
    EntityModule.forRoot(
      config.PRODUCTS_DATABASE_URI,
      ProductsDbConnectionMap.WealthAnalyzer
    ),
    InstitutionModule,
    AssetModule,
  ],
})
export class WealthAnalyzerModule {}
