export class FindInstitutionByNameQuery {
  constructor(
    public readonly userId: string,
    public readonly institutionName: string
  ) {}
}
