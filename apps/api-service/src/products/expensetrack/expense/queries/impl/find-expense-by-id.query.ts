export class FindExpenseByIdQuery {
  constructor(
    public readonly userId: string,
    public readonly expenseId: string
  ) {}
}
