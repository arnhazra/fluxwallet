import { Injectable } from "@nestjs/common"
import { Expense } from "./schemas/expense.schema"
import { AppsDbConnectionMap } from "@/shared/entity/entity-db-connection.map"
import {
  EntityModel,
  EntityRepository,
  InjectEntityModel,
} from "@/shared/entity/entity.repository"

@Injectable()
export class ExpenseRepository extends EntityRepository<Expense> {
  constructor(
    @InjectEntityModel(Expense.name, AppsDbConnectionMap.ExpenseTrack)
    private expenseModel: EntityModel<Expense>
  ) {
    super(expenseModel)
  }
}
