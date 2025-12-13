import { Module } from "@nestjs/common"
import { EntityModule } from "@/shared/entity/entity.module"
import { config } from "@/config"
import { AppsDbConnectionMap } from "@/shared/entity/entity-db-connection.map"
import { CashFlowService } from "./cashflow.service"
import { CashFlowController } from "./cashflow.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { Goal, GoalSchema } from "./schemas/cashflow.schema"
import { CashFlowRepository } from "./cashflow.repository"
import { CreateGoalCommandHandler } from "./commands/handler/create-goal.handler"
import { DeleteGoalCommandHandler } from "./commands/handler/delete-goal.handler"
import { FindGoalByIdQueryHandler } from "./queries/handler/find-goal-by-id.handler"
import { UpdateGoalCommandHandler } from "./commands/handler/update-goal.handler"
import { FindGoalsByUserQueryHandler } from "./queries/handler/find-goal-by-user.handler"
import { FindNearestGoalQueryHandler } from "./queries/handler/find-nearest-goal.handler"

@Module({
  imports: [
    CqrsModule,
    EntityModule.forRoot(
      config.APPS_DATABASE_URI,
      AppsDbConnectionMap.CashFlow
    ),
    EntityModule.forFeature(
      [{ name: Goal.name, schema: GoalSchema }],
      AppsDbConnectionMap.WealthGoal
    ),
  ],
  controllers: [CashFlowController],
  providers: [
    CashFlowService,
    CashFlowRepository,
    CreateGoalCommandHandler,
    UpdateGoalCommandHandler,
    DeleteGoalCommandHandler,
    FindGoalsByUserQueryHandler,
    FindGoalByIdQueryHandler,
    FindNearestGoalQueryHandler,
  ],
})
export class CashFlowModule {}
