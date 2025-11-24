import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { DeleteSpaceCommand } from "../impl/delete-space.command"
import { SpaceRepository } from "../../space.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@CommandHandler(DeleteSpaceCommand)
export class DeleteSpaceCommandHandler
  implements ICommandHandler<DeleteSpaceCommand>
{
  constructor(private readonly repository: SpaceRepository) {}

  async execute(command: DeleteSpaceCommand) {
    const { spaceId } = command
    return await this.repository.delete({
      _id: createOrConvertObjectId(spaceId),
    })
  }
}
