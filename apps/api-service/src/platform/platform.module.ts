import { Module } from "@nestjs/common"
import { SubscriptionModule } from "./subscription/subscription.module"
import { config } from "src/config"
import { GeneralDbConnectionMap } from "@/shared/constants/db-connection.map"
import { AnalyticsModule } from "./analytics/analytics.module"
import { EntityModule } from "@/shared/entity/entity.module"
import { EmailModule } from "./email/email.module"
import { ConfigModule } from "./config/config.module"
import { IntelligenceModule } from "./intelligence/intelligence.module"

@Module({
  imports: [
    EntityModule.forRoot(
      config.PLATFORM_DATABASE_URI,
      GeneralDbConnectionMap.Platform
    ),
    AnalyticsModule,
    SubscriptionModule,
    EmailModule,
    ConfigModule,
    IntelligenceModule,
  ],
})
export class PlatformModule {}
