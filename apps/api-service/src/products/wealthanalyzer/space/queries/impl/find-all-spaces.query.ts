export class FindAllSpaceQuery {
  constructor(
    public readonly userId: string,
    public readonly searchKeyword?: string
  ) {}
}
