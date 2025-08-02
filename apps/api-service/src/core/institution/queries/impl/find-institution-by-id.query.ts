export class FindInstitutionByIdQuery {
  constructor(
    public readonly userId: string,
    public readonly institutionId: string
  ) {}
}
