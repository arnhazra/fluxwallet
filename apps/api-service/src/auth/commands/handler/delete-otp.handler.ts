import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { DeleteOTPCommand } from "../impl/delete-otp.command"
import { OTPRepository } from "@/auth/repositories/otp.repository"

@CommandHandler(DeleteOTPCommand)
export class DeleteOTPCommandHandler
  implements ICommandHandler<DeleteOTPCommand>
{
  constructor(private readonly repository: OTPRepository) {}

  async execute(command: DeleteOTPCommand) {
    const { email } = command
    await this.repository.delete({ email })
  }
}
