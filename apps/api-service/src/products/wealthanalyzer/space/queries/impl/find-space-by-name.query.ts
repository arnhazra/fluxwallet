export class FindSpaceByNameQuery {
  constructor(
    public readonly userId: string,
    public readonly spaceName: string
  ) {}
}
