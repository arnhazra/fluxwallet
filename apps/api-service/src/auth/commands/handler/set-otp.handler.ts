import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { SetOTPCommand } from "../impl/set-otp.command"
import { OTPRepository } from "@/auth/repositories/otp.repository"

@CommandHandler(SetOTPCommand)
export class SetOTPCommandHandler implements ICommandHandler<SetOTPCommand> {
  constructor(private readonly repository: OTPRepository) {}

  async execute(command: SetOTPCommand) {
    const { email, hashedOTP } = command
    await this.repository.delete({ email })
    return await this.repository.create({
      email,
      hashedOTP,
    })
  }
}
