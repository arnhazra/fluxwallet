import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { DeleteTokenCommand } from "../impl/delete-token.command"
import { TokenRepository } from "../../token.repository"
import objectId from "@/shared/utils/convert-objectid"

@CommandHandler(DeleteTokenCommand)
export class DeleteTokenCommandHandler
  implements ICommandHandler<DeleteTokenCommand>
{
  constructor(private readonly repository: TokenRepository) {}

  async execute(command: DeleteTokenCommand) {
    const { userId } = command
    await this.repository.delete({ userId: objectId(userId) })
  }
}
