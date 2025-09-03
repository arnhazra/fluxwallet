import { Module } from "@nestjs/common"
import { TaxAdvisorService } from "./taxadvisor.service"
import { TaxAdvisorController } from "./taxadvisor.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { ProductsDbConnectionMap } from "src/shared/utils/db-connection.map"
import { Thread, ThreadSchema } from "./schemas/thread.schema"
import { CreateThreadCommandHandler } from "./commands/handler/create-thread.handler"
import { TaxAdvisorRepository } from "./taxadvisor.repository"
import { EntityModule } from "@/shared/entity/entity.module"
import { FetchThreadByIdQueryHandler } from "./queries/handler/fetch-thread-by-id.handler"
import { HttpModule } from "@nestjs/axios"
import { TaxAdvisorStrategy } from "./taxadvisor.strategy"
import { config } from "@/config"

@Module({
  imports: [
    HttpModule,
    CqrsModule,
    EntityModule.forRoot(
      config.PRODUCTS_DATABASE_URI,
      ProductsDbConnectionMap.TaxAdvisor
    ),
    EntityModule.forFeature(
      [{ name: Thread.name, schema: ThreadSchema }],
      ProductsDbConnectionMap.TaxAdvisor
    ),
  ],
  controllers: [TaxAdvisorController],
  providers: [
    TaxAdvisorService,
    TaxAdvisorRepository,
    TaxAdvisorStrategy,
    CreateThreadCommandHandler,
    FetchThreadByIdQueryHandler,
  ],
})
export class TaxAdvisorModule {}
