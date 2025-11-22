import { Module } from "@nestjs/common"
import { ExpenseModule } from "./expense/expense.module"
import { EntityModule } from "@/shared/entity/entity.module"
import { config } from "@/config"
import { AppsDbConnectionMap } from "@/shared/constants/db-connection.map"

@Module({
  imports: [
    EntityModule.forRoot(
      config.APPS_DATABASE_URI,
      AppsDbConnectionMap.ExpenseTrack
    ),
    ExpenseModule,
  ],
})
export class ExpenseTrackModule {}
