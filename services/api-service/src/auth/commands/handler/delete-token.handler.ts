import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { DeleteTokenCommand } from "../impl/delete-token.command"
import { TokenRepository } from "../../repositories/token.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@CommandHandler(DeleteTokenCommand)
export class DeleteTokenCommandHandler implements ICommandHandler<DeleteTokenCommand> {
  constructor(private readonly repository: TokenRepository) {}

  async execute(command: DeleteTokenCommand) {
    const { userId } = command
    await this.repository.delete({ userId: createOrConvertObjectId(userId) })
  }
}
