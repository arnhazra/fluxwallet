import { Module } from "@nestjs/common"
import { SubscriptionModule } from "./subscription/subscription.module"
import { config } from "src/config"
import { GeneralDbConnectionMap } from "src/shared/utils/db-connection.map"
import { ActivityModule } from "./activity/activity.module"
import { EntityModule } from "@/shared/entity/entity.module"
import { EmailModule } from "./email/email.module"
import { ConfigModule } from "./config/config.module"

@Module({
  imports: [
    EntityModule.forRoot(config.CORE_DATABASE_URI, GeneralDbConnectionMap.Core),
    ActivityModule,
    SubscriptionModule,
    EmailModule,
    ConfigModule,
  ],
})
export class PlatformModule {}
