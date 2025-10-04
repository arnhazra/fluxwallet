import { Module } from "@nestjs/common"
import { OneAgentService } from "./oneagent.service"
import { OneAgentController } from "./oneagent.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { ProductsDbConnectionMap } from "@/shared/constants/db-connection.map"
import { Thread, ThreadSchema } from "./schemas/thread.schema"
import { CreateThreadCommandHandler } from "./commands/handler/create-thread.handler"
import { OneAgentRepository } from "./oneagent.repository"
import { EntityModule } from "@/shared/entity/entity.module"
import { FetchThreadByIdQueryHandler } from "./queries/handler/fetch-thread-by-id.handler"
import { HttpModule } from "@nestjs/axios"
import { OneAgentStrategy } from "./oneagent.strategy"
import { ChatTools } from "./tools/chat.tool"
import { config } from "@/config"
import { SummarizeTools } from "./tools/summarize.tool"

@Module({
  imports: [
    HttpModule,
    CqrsModule,
    EntityModule.forRoot(
      config.PRODUCTS_DATABASE_URI,
      ProductsDbConnectionMap.OneAgent
    ),
    EntityModule.forFeature(
      [{ name: Thread.name, schema: ThreadSchema }],
      ProductsDbConnectionMap.OneAgent
    ),
  ],
  controllers: [OneAgentController],
  providers: [
    OneAgentService,
    OneAgentRepository,
    OneAgentStrategy,
    ChatTools,
    SummarizeTools,
    CreateThreadCommandHandler,
    FetchThreadByIdQueryHandler,
  ],
})
export class OneAgentModule {}
