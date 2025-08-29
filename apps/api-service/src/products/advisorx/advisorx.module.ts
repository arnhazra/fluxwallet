import { Module } from "@nestjs/common"
import { AdvisorXService } from "./advisorx.service"
import { AdvisorXController } from "./advisorx.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { ProductsDbConnectionMap } from "src/shared/utils/db-connection.map"
import { Thread, ThreadSchema } from "./schemas/thread.schema"
import { CreateThreadCommandHandler } from "./commands/handler/create-thread.handler"
import { AdvisorXRepository } from "./advisorx.repository"
import { EntityModule } from "@/shared/entity/entity.module"
import { FetchThreadByIdQueryHandler } from "./queries/handler/fetch-thread-by-id.handler"
import { HttpModule } from "@nestjs/axios"
import { AdvisorXStrategy } from "./advisorx.strategy"
import { AdvisorXAgent } from "./advisorx.agent"
import { config } from "@/config"

@Module({
  imports: [
    HttpModule,
    CqrsModule,
    EntityModule.forRoot(
      config.PRODUCTS_DATABASE_URI,
      ProductsDbConnectionMap.AdvisorX
    ),
    EntityModule.forFeature(
      [
        {
          name: Thread.name,
          schema: ThreadSchema,
        },
      ],
      ProductsDbConnectionMap.AdvisorX
    ),
  ],
  controllers: [AdvisorXController],
  providers: [
    AdvisorXService,
    AdvisorXRepository,
    AdvisorXStrategy,
    AdvisorXAgent,
    CreateThreadCommandHandler,
    FetchThreadByIdQueryHandler,
  ],
})
export class AdvisorXModule {}
