import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { SpaceRepository } from "../../space.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"
import { UpdateSpaceCommand } from "../impl/update-space.command"

@CommandHandler(UpdateSpaceCommand)
export class UpdateSpaceCommandHandler
  implements ICommandHandler<UpdateSpaceCommand>
{
  constructor(private readonly repository: SpaceRepository) {}

  async execute(command: UpdateSpaceCommand) {
    const {
      spaceId,
      dto: { spaceName },
    } = command
    return await this.repository.update(
      { _id: createOrConvertObjectId(spaceId) },
      {
        spaceName,
      }
    )
  }
}
