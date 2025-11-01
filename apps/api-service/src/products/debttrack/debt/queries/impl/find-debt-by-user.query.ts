export class FindDebtsByUserQuery {
  constructor(
    public readonly userId: string,
    public readonly searchKeyword?: string
  ) {}
}
