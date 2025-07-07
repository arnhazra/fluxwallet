export class FindAssetByIdQuery {
  constructor(
    public readonly userId: string,
    public readonly assetId: string
  ) {}
}
