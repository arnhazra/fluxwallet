export class SetOTPCommand {
  constructor(
    public readonly email: string,
    public readonly hashedOTP: string
  ) {}
}
