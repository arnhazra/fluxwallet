import { Module } from "@nestjs/common"
import { BaseModelModule } from "./basemodel/basemodel.module"
import { ChatModule } from "./chat/chat.module"
import { config } from "@/config"
import { EntityModule } from "@/shared/entity/entity.module"
import { DbConnectionMap } from "@/shared/utils/db-connection.map"

@Module({
  imports: [
    EntityModule.forRoot(config.REPLICA_DATABASE_URI, DbConnectionMap.Replica),
    BaseModelModule,
    ChatModule,
  ],
})
export class IntelligenceModule {}
