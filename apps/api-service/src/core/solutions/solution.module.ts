import { Module } from "@nestjs/common"
import { SolutionService } from "./solution.service"
import { SolutionController } from "./solution.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { GeneralDbConnectionMap } from "src/shared/utils/db-connection.map"
import { Solution, SolutionSchema } from "./schemas/solution.schema"
import { SolutionRepository } from "./solution.repository"
import { EntityModule } from "@/shared/entity/entity.module"
import { GetSolutionQueryHandler } from "./queries/handler/get-solutions.handler"

@Module({
  imports: [
    CqrsModule,
    EntityModule.forFeature(
      [{ name: Solution.name, schema: SolutionSchema }],
      GeneralDbConnectionMap.Core
    ),
  ],
  controllers: [SolutionController],
  providers: [SolutionService, SolutionRepository, GetSolutionQueryHandler],
})
export class SolutionModule {}
