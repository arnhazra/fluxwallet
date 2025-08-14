import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { AuthRepository } from "../../auth.repository"
import { CreateUserCommand } from "../impl/create-user.command"

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(private readonly repository: AuthRepository) {}

  async execute(command: CreateUserCommand) {
    const { email, name } = command
    return await this.repository.create({ email, name })
  }
}
