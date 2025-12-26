export class DeleteTokenCommand {
  constructor(
    public readonly userId: string,
    public readonly token?: string
  ) {}
}
