export class FindAssetsByTypesQuery {
  constructor(
    public readonly userId: string,
    public readonly assetTypes: string[]
  ) {}
}
