import { Module } from "@nestjs/common"
import { SubscriptionModule } from "./subscription/subscription.module"
import { config } from "src/config"
import { GeneralDbConnectionMap } from "@/shared/constants/db-connection.map"
import { ActivityModule } from "./activity/activity.module"
import { EntityModule } from "@/shared/entity/entity.module"
import { EmailModule } from "./email/email.module"
import { ConfigModule } from "./config/config.module"

@Module({
  imports: [
    EntityModule.forRoot(
      config.PLATFORM_DATABASE_URI,
      GeneralDbConnectionMap.Platform
    ),
    ActivityModule,
    SubscriptionModule,
    EmailModule,
    ConfigModule,
  ],
})
export class PlatformModule {}
