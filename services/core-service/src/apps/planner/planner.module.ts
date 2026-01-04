import { Module } from "@nestjs/common"
import { EventModule } from "./event/event.module"
import { EntityModule } from "@/shared/entity/entity.module"
import { config } from "@/config"
import { AppsDbConnectionMap } from "@/shared/entity/entity-db-connection.map"

@Module({
  imports: [
    EntityModule.forRoot(config.APPS_DATABASE_URI, AppsDbConnectionMap.Planner),
    EventModule,
  ],
})
export class PlannerModule {}
