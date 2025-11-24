import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { UserRepository } from "../../repositories/user.repository"
import { UpdateAttributeCommand } from "../impl/update-attribute.command"

@CommandHandler(UpdateAttributeCommand)
export class UpdateAttributeCommandHandler
  implements ICommandHandler<UpdateAttributeCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: UpdateAttributeCommand) {
    const { userId, attributeName, attributeValue } = command
    return await this.repository.updateOneById(
      userId,
      attributeName,
      attributeValue as any
    )
  }
}
