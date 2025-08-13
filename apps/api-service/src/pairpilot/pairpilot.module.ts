import { Module } from "@nestjs/common"
import { PairPilotService } from "./pairpilot.service"
import { PairPilotController } from "./pairpilot.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { DbConnectionMap } from "src/shared/utils/db-connection.map"
import { Thread, ThreadSchema } from "./schemas/thread.schema"
import { CreateThreadCommandHandler } from "./commands/handler/create-thread.handler"
import { PairPilotRepository } from "./pairpilot.repository"
import { EntityModule } from "@/shared/entity/entity.module"
import { FetchThreadByIdQueryHandler } from "./queries/handler/fetch-thread-by-id.handler"
import { HttpModule } from "@nestjs/axios"
import { PairPilotStrategy } from "./pairpilot.strategy"
import { PairPilotAgent } from "./pairpilot.agent"

@Module({
  imports: [
    HttpModule,
    CqrsModule,
    EntityModule.forFeature(
      [{ name: Thread.name, schema: ThreadSchema }],
      DbConnectionMap.Primary
    ),
  ],
  controllers: [PairPilotController],
  providers: [
    PairPilotService,
    PairPilotRepository,
    PairPilotStrategy,
    PairPilotAgent,
    CreateThreadCommandHandler,
    FetchThreadByIdQueryHandler,
  ],
})
export class PairPilotModule {}
