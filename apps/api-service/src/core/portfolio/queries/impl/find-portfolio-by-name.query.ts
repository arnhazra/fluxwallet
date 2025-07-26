export class FindPortfolioByNameQuery {
  constructor(
    public readonly userId: string,
    public readonly portfolioName: string
  ) {}
}
