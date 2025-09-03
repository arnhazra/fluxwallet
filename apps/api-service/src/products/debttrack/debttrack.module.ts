import { Module } from "@nestjs/common"
import { DebtModule } from "./debt/debt.module"
import { EntityModule } from "@/shared/entity/entity.module"
import { config } from "@/config"
import { ProductsDbConnectionMap } from "@/shared/constants/db-connection.map"

@Module({
  imports: [
    EntityModule.forRoot(
      config.PRODUCTS_DATABASE_URI,
      ProductsDbConnectionMap.DebtTrack
    ),
    DebtModule,
  ],
})
export class DebtTrackModule {}
