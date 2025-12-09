import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { SetTokenCommand } from "../impl/set-token.command"
import { TokenRepository } from "../../repositories/token.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@CommandHandler(SetTokenCommand)
export class SetTokenCommandHandler implements ICommandHandler<SetTokenCommand> {
  constructor(private readonly repository: TokenRepository) {}

  async execute(command: SetTokenCommand) {
    const { userId, token } = command
    return await this.repository.create({
      userId: createOrConvertObjectId(userId),
      token,
    })
  }
}
