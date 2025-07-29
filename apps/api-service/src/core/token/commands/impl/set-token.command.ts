export class SetTokenCommand {
  constructor(
    public readonly userId: string,
    public readonly token: string
  ) {}
}
