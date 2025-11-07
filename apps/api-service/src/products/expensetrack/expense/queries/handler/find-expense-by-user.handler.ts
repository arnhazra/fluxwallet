import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindExpensesByUserQuery } from "../impl/find-expense-by-user.query"
import { ExpenseRepository } from "../../expense.repository"
import objectId from "@/shared/utils/convert-objectid"

@QueryHandler(FindExpensesByUserQuery)
export class FindExpensesByUserQueryHandler
  implements IQueryHandler<FindExpensesByUserQuery>
{
  constructor(private readonly repository: ExpenseRepository) {}

  async execute(query: FindExpensesByUserQuery) {
    const { userId } = query

    return this.repository.aggregate([
      { $match: { userId: objectId(userId) } },
      { $sort: { expenseDate: 1 } },
    ])
  }
}
