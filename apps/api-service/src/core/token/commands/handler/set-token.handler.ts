import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { SetTokenCommand } from "../impl/set-token.command"
import { TokenRepository } from "../../token.repository"
import objectId from "src/shared/utils/convert-objectid"

@CommandHandler(SetTokenCommand)
export class SetTokenCommandHandler
  implements ICommandHandler<SetTokenCommand>
{
  constructor(private readonly repository: TokenRepository) {}

  async execute(command: SetTokenCommand) {
    const { userId, token } = command
    await this.repository.delete({ userId: objectId(userId) })
    return await this.repository.create({
      userId: objectId(userId),
      token,
    })
  }
}
