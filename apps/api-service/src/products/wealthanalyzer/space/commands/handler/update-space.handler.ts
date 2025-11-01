import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { SpaceRepository } from "../../space.repository"
import objectId from "@/shared/utils/convert-objectid"
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
      { _id: objectId(spaceId) },
      {
        spaceName,
      }
    )
  }
}
