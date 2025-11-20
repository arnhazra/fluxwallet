import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindExpenseByIdQuery } from "../impl/find-expense-by-id.query"
import { ExpenseRepository } from "../../expense.repository"
import objectId from "@/shared/utils/convert-objectid"

@QueryHandler(FindExpenseByIdQuery)
export class FindExpenseByIdQueryHandler
  implements IQueryHandler<FindExpenseByIdQuery>
{
  constructor(private readonly repository: ExpenseRepository) {}

  async execute(query: FindExpenseByIdQuery) {
    const { expenseId, userId } = query
    return await this.repository.findOne({
      _id: objectId(expenseId),
      userId: objectId(userId),
    })
  }
}
