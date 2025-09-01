import { Module } from "@nestjs/common"
import { IntelligenceService } from "./intelligence.service"
import { IntelligenceController } from "./intelligence.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { ProductsDbConnectionMap } from "src/shared/utils/db-connection.map"
import { Thread, ThreadSchema } from "./schemas/thread.schema"
import { CreateThreadCommandHandler } from "./commands/handler/create-thread.handler"
import { IntelligenceRepository } from "./intelligence.repository"
import { EntityModule } from "@/shared/entity/entity.module"
import { FetchThreadByIdQueryHandler } from "./queries/handler/fetch-thread-by-id.handler"
import { HttpModule } from "@nestjs/axios"
import { IntelligenceStrategy } from "./intelligence.strategy"
import { ChatTools } from "./tools/chat.tool"
import { config } from "@/config"
import { SummarizeTools } from "./tools/summarize.tool"

@Module({
  imports: [
    HttpModule,
    CqrsModule,
    EntityModule.forRoot(
      config.PRODUCTS_DATABASE_URI,
      ProductsDbConnectionMap.Intelligence
    ),
    EntityModule.forFeature(
      [{ name: Thread.name, schema: ThreadSchema }],
      ProductsDbConnectionMap.Intelligence
    ),
  ],
  controllers: [IntelligenceController],
  providers: [
    IntelligenceService,
    IntelligenceRepository,
    IntelligenceStrategy,
    ChatTools,
    SummarizeTools,
    CreateThreadCommandHandler,
    FetchThreadByIdQueryHandler,
  ],
})
export class IntelligenceModule {}
