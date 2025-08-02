import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { CreateAssetCommand } from "../impl/create-asset.command"
import { AssetRepository } from "../../asset.repository"
import objectId from "@/shared/utils/convert-objectid"

@CommandHandler(CreateAssetCommand)
export class CreateAssetCommandHandler
  implements ICommandHandler<CreateAssetCommand>
{
  constructor(private readonly repository: AssetRepository) {}

  async execute(command: CreateAssetCommand) {
    const { userId, dto } = command
    const { institutionId, ...otherFields } = dto
    return await this.repository.create({
      userId: objectId(userId),
      institutionId: objectId(institutionId),
      ...otherFields,
    })
  }
}
