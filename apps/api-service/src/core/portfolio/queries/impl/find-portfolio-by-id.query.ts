export class FindPortfolioByIdQuery {
  constructor(
    public readonly userId: string,
    public readonly portfolioId: string
  ) {}
}
