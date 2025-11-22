import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Expense } from "./schemas/expense.schema"
import { AppsDbConnectionMap } from "@/shared/constants/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class ExpenseRepository extends EntityRepository<Expense> {
  constructor(
    @InjectModel(Expense.name, AppsDbConnectionMap.ExpenseTrack)
    private expenseModel: Model<Expense>
  ) {
    super(expenseModel)
  }
}
