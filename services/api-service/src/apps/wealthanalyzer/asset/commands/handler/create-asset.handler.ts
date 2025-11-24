import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { CreateAssetCommand } from "../impl/create-asset.command"
import { AssetRepository } from "../../asset.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@CommandHandler(CreateAssetCommand)
export class CreateAssetCommandHandler
  implements ICommandHandler<CreateAssetCommand>
{
  constructor(private readonly repository: AssetRepository) {}

  async execute(command: CreateAssetCommand) {
    const { userId, dto } = command
    const { spaceId, ...otherFields } = dto
    return await this.repository.create({
      userId: createOrConvertObjectId(userId),
      spaceId: createOrConvertObjectId(spaceId),
      ...otherFields,
    })
  }
}
