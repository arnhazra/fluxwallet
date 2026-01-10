import { Module } from "@nestjs/common"
import { TaxAdvisorService } from "./sscompare.service"
import { TaxAdvisorController } from "./sscompare.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { AppsDbConnectionMap } from "@/shared/entity/entity-db-connection.map"
import { Thread, ThreadSchema } from "./schemas/thread.schema"
import { CreateThreadCommandHandler } from "./commands/handler/create-thread.handler"
import { TaxAdvisorRepository } from "./sscompare.repository"
import { EntityModule } from "@/shared/entity/entity.module"
import { FetchThreadByIdQueryHandler } from "./queries/handler/fetch-thread-by-id.handler"
import { HttpModule } from "@nestjs/axios"
import { TaxAdvisorStrategy } from "./sscompare.strategy"
import { config } from "@/config"
import { TaxAdvisorAgent } from "./agents/taxadvisor.agent"

@Module({
  imports: [
    HttpModule,
    CqrsModule,
    EntityModule.forRoot(
      config.APPS_DATABASE_URI,
      AppsDbConnectionMap.SSCompare
    ),
    EntityModule.forFeature(
      [{ name: Thread.name, schema: ThreadSchema }],
      AppsDbConnectionMap.SSCompare
    ),
  ],
  controllers: [TaxAdvisorController],
  providers: [
    TaxAdvisorService,
    TaxAdvisorRepository,
    TaxAdvisorAgent,
    TaxAdvisorStrategy,
    CreateThreadCommandHandler,
    FetchThreadByIdQueryHandler,
  ],
})
export class SSCompareModule {}
