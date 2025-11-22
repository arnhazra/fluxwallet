export class FindAssetsBySpaceQuery {
  constructor(
    public readonly userId: string,
    public readonly spaceId: string,
    public readonly searchKeyword?: string
  ) {}
}
