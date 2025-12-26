export class FindCashflowsByUserQuery {
  constructor(
    public readonly userId: string,
    public readonly searchKeyword: string
  ) {}
}
