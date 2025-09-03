import { Module } from "@nestjs/common"
import { DebtService } from "./debt.service"
import { DebtController } from "./debt.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { Debt, DebtSchema } from "./schemas/debt.schema"
import { ProductsDbConnectionMap } from "@/shared/constants/db-connection.map"
import { DebtRepository } from "./debt.repository"
import { CreateDebtCommandHandler } from "./commands/handler/create-debt.handler"
import { DeleteDebtCommandHandler } from "./commands/handler/delete-debt.handler"
import { FindDebtByIdQueryHandler } from "./queries/handler/find-debt-by-id.handler"
import { EntityModule } from "@/shared/entity/entity.module"
import { UpdateDebtCommandHandler } from "./commands/handler/update-debt.handler"
import { FindDebtsByUserQueryHandler } from "./queries/handler/find-debt-by-user.handler"

@Module({
  imports: [
    CqrsModule,
    EntityModule.forFeature(
      [{ name: Debt.name, schema: DebtSchema }],
      ProductsDbConnectionMap.DebtTrack
    ),
  ],
  controllers: [DebtController],
  providers: [
    DebtService,
    DebtRepository,
    CreateDebtCommandHandler,
    UpdateDebtCommandHandler,
    DeleteDebtCommandHandler,
    FindDebtsByUserQueryHandler,
    FindDebtByIdQueryHandler,
  ],
})
export class DebtModule {}
