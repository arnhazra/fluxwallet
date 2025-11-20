import { Module } from "@nestjs/common"
import { AssetModule } from "./asset/asset.module"
import { SpaceModule } from "./space/space.module"
import { EntityModule } from "@/shared/entity/entity.module"
import { config } from "@/config"
import { AppsDbConnectionMap } from "@/shared/constants/db-connection.map"

@Module({
  imports: [
    EntityModule.forRoot(
      config.APPS_DATABASE_URI,
      AppsDbConnectionMap.WealthAnalyzer
    ),
    SpaceModule,
    AssetModule,
  ],
})
export class WealthAnalyzerModule {}
