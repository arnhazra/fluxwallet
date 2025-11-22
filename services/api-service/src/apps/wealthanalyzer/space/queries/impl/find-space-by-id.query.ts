export class FindSpaceByIdQuery {
  constructor(
    public readonly userId: string,
    public readonly spaceId: string
  ) {}
}
