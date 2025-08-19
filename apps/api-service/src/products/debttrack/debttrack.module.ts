import { Module } from "@nestjs/common"
import { EntityModule } from "@/shared/entity/entity.module"
import { config } from "@/config"
import { ProductsDbConnectionMap } from "@/shared/utils/db-connection.map"

@Module({
  imports: [
    EntityModule.forRoot(
      config.PRODUCTS_DATABASE_URI,
      ProductsDbConnectionMap.DebtTrack
    ),
  ],
})
export class DebtTrackModule {}
