export class FindAllAssetQuery {
  constructor(
    public readonly userId: string,
    public readonly portfolioId: string
  ) {}
}
