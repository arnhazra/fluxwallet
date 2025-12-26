import { Module } from "@nestjs/common"
import { config } from "src/config"
import { GeneralDbConnectionMap } from "@/shared/entity/entity-db-connection.map"
import { AnalyticsModule } from "./analytics/analytics.module"
import { EntityModule } from "@/shared/entity/entity.module"
import { EmailModule } from "./email/email.module"
import { ConfigModule } from "./config/config.module"
import { IntelligenceModule } from "./intelligence/intelligence.module"
import { WidgetModule } from "./widget/widget.module"

@Module({
  imports: [
    EntityModule.forRoot(
      config.PLATFORM_DATABASE_URI,
      GeneralDbConnectionMap.Platform
    ),
    AnalyticsModule,
    EmailModule,
    ConfigModule,
    IntelligenceModule,
    WidgetModule,
  ],
})
export class PlatformModule {}
