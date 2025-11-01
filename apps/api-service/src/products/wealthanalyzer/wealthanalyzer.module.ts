import { Module } from "@nestjs/common"
import { AssetModule } from "./asset/asset.module"
import { SpaceModule } from "./space/space.module"
import { EntityModule } from "@/shared/entity/entity.module"
import { config } from "@/config"
import { ProductsDbConnectionMap } from "@/shared/constants/db-connection.map"

@Module({
  imports: [
    EntityModule.forRoot(
      config.PRODUCTS_DATABASE_URI,
      ProductsDbConnectionMap.WealthAnalyzer
    ),
    SpaceModule,
    AssetModule,
  ],
})
export class WealthAnalyzerModule {}
