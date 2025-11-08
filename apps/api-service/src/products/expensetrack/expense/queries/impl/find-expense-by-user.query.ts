import { ExpenseCategory } from "@/shared/constants/types"

export class FindExpensesByUserQuery {
  constructor(
    public readonly userId: string,
    public readonly monthFilter?: string,
    public readonly searchKeyword?: string,
    public readonly expenseCategory?: ExpenseCategory
  ) {}
}
