export class FindAllAssetQuery {
  constructor(
    public readonly userId: string,
    public readonly institutionId: string
  ) {}
}
