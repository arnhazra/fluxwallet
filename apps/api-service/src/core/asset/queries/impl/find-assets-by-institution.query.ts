export class FindAssetsByInstitutionQuery {
  constructor(
    public readonly userId: string,
    public readonly institutionId: string
  ) {}
}
