import { Module } from "@nestjs/common"
import { IntelligenceService } from "./intelligence.service"
import { IntelligenceController } from "./intelligence.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { GeneralDbConnectionMap } from "@/shared/entity/entity-db-connection.map"
import { Thread, ThreadSchema } from "./schemas/thread.schema"
import { CreateThreadCommandHandler } from "./commands/handler/create-thread.handler"
import { IntelligenceRepository } from "./intelligence.repository"
import { EntityModule } from "@/shared/entity/entity.module"
import { FetchThreadByIdQueryHandler } from "./queries/handler/fetch-thread-by-id.handler"
import { HttpModule } from "@nestjs/axios"
import { ChatAgent } from "./agents/chat.agent"
import { config } from "@/config"
import { SummarizerStrategy } from "./strategies/summarizer.strategy"
import { ChatStrategy } from "./strategies/chat.strategy"

@Module({
  imports: [
    HttpModule,
    CqrsModule,
    EntityModule.forRoot(
      config.PLATFORM_DATABASE_URI,
      GeneralDbConnectionMap.Platform
    ),
    EntityModule.forFeature(
      [{ name: Thread.name, schema: ThreadSchema }],
      GeneralDbConnectionMap.Platform
    ),
  ],
  controllers: [IntelligenceController],
  providers: [
    IntelligenceService,
    IntelligenceRepository,
    SummarizerStrategy,
    ChatStrategy,
    ChatAgent,
    CreateThreadCommandHandler,
    FetchThreadByIdQueryHandler,
  ],
})
export class IntelligenceModule {}
