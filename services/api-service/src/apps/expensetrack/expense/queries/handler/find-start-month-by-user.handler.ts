import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindStartMonthByUserQuery } from "../impl/find-start-month-by-user.query"
import { ExpenseRepository } from "../../expense.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@QueryHandler(FindStartMonthByUserQuery)
export class FindStartMonthByUserQueryHandler
  implements IQueryHandler<FindStartMonthByUserQuery>
{
  constructor(private readonly repository: ExpenseRepository) {}

  async execute(query: FindStartMonthByUserQuery) {
    const { userId } = query

    const [result] = await this.repository.aggregate([
      { $match: { userId: createOrConvertObjectId(userId) } },
      { $sort: { expenseDate: 1 } },
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          expenseDate: 1,
        },
      },
    ])

    if (!result?.expenseDate) {
      return { startMonth: null }
    }

    const date = new Date(result.expenseDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")

    return { startMonth: `${year}-${month}` }
  }
}
