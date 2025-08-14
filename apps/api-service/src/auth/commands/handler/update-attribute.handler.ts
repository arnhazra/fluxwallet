import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { AuthRepository } from "../../auth.repository"
import { UpdateAttributeCommand } from "../impl/update-attribute.command"

@CommandHandler(UpdateAttributeCommand)
export class UpdateAttributeCommandHandler
  implements ICommandHandler<UpdateAttributeCommand>
{
  constructor(private readonly repository: AuthRepository) {}

  async execute(command: UpdateAttributeCommand) {
    const { userId, attributeName, attributeValue } = command
    return await this.repository.updateOneById(
      userId,
      attributeName,
      attributeValue
    )
  }
}
