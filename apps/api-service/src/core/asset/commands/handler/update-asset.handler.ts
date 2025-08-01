import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { AssetRepository } from "../../asset.repository"
import objectId from "@/shared/utils/convert-objectid"
import { UpdateAssetCommand } from "../impl/update-asset.command"

@CommandHandler(UpdateAssetCommand)
export class UpdateAssetCommandHandler
  implements ICommandHandler<UpdateAssetCommand>
{
  constructor(private readonly repository: AssetRepository) {}

  async execute(command: UpdateAssetCommand) {
    const { assetId, dto } = command
    const { institutionId, ...otherFields } = dto
    return await this.repository.update(
      { _id: objectId(assetId) },
      {
        institutionId: objectId(institutionId),
        ...otherFields,
      }
    )
  }
}
