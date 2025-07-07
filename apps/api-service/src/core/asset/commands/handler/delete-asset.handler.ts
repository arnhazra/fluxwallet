import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { DeleteAssetCommand } from "../impl/delete-asset.command"
import { AssetRepository } from "../../asset.repository"
import objectId from "src/shared/utils/convert-objectid"

@CommandHandler(DeleteAssetCommand)
export class DeleteAssetCommandHandler
  implements ICommandHandler<DeleteAssetCommand>
{
  constructor(private readonly repository: AssetRepository) {}

  async execute(command: DeleteAssetCommand) {
    const { assetId } = command
    return await this.repository.delete({ _id: objectId(assetId) })
  }
}
