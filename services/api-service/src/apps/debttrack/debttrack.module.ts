import { Module } from "@nestjs/common"
import { DebtModule } from "./debt/debt.module"
import { EntityModule } from "@/shared/entity/entity.module"
import { config } from "@/config"
import { AppsDbConnectionMap } from "@/shared/entity/entity-db-connection.map"

@Module({
  imports: [
    EntityModule.forRoot(
      config.APPS_DATABASE_URI,
      AppsDbConnectionMap.DebtTrack
    ),
    DebtModule,
  ],
})
export class DebtTrackModule {}
