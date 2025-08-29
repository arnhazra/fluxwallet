export class FindDebtByIdQuery {
  constructor(
    public readonly userId: string,
    public readonly debtId: string
  ) {}
}
