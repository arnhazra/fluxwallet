import { Module } from "@nestjs/common"
import { IntelligenceService } from "./intelligence.service"
import { IntelligenceController } from "./intelligence.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { DbConnectionMap } from "src/shared/utils/db-connection.map"
import { Thread, ThreadSchema } from "./schemas/thread.schema"
import { CreateThreadCommandHandler } from "./commands/handler/create-thread.handler"
import { IntelligenceRepository } from "./intelligence.repository"
import { EntityModule } from "@/shared/entity/entity.module"
import { FetchThreadByIdQueryHandler } from "./queries/handler/fetch-thread-by-id.handler"
import { GetUsageByUserIdQueryHandler } from "./queries/handler/get-usage-by-user-id.handler"
import { HttpModule } from "@nestjs/axios"
import { IntelligenceStrategy } from "./intelligence.strategy"

@Module({
  imports: [
    HttpModule,
    CqrsModule,
    EntityModule.forFeature(
      [{ name: Thread.name, schema: ThreadSchema }],
      DbConnectionMap.Primary
    ),
  ],
  controllers: [IntelligenceController],
  providers: [
    IntelligenceService,
    IntelligenceRepository,
    IntelligenceStrategy,
    CreateThreadCommandHandler,
    FetchThreadByIdQueryHandler,
    GetUsageByUserIdQueryHandler,
  ],
})
export class IntelligenceModule {}
