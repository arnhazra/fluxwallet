import { Module } from "@nestjs/common"
import { AnalyticsService } from "./analytics.service"
import { AnalyticsController } from "./analytics.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { GeneralDbConnectionMap } from "@/shared/entity/entity-db-connection.map"
import { Analytics, AnalyticsSchema } from "./schemas/analytics.schema"
import { AnalyticsRepository } from "./analytics.repository"
import { CreateAnalyticsCommandHandler } from "./commands/handler/create-analytics.handler"
import { EntityModule } from "@/shared/entity/entity.module"
import { GetAnalyticsQueryHandler } from "./queries/handler/get-analytics-count.handler"

@Module({
  imports: [
    CqrsModule,
    EntityModule.forFeature(
      [{ name: Analytics.name, schema: AnalyticsSchema }],
      GeneralDbConnectionMap.Platform
    ),
  ],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    AnalyticsRepository,
    CreateAnalyticsCommandHandler,
    GetAnalyticsQueryHandler,
  ],
})
export class AnalyticsModule {}
