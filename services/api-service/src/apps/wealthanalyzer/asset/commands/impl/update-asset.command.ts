import { CreateAssetRequestDto } from "../../dto/request/create-asset.request.dto"

export class UpdateAssetCommand {
  constructor(
    public readonly userId: string,
    public readonly assetId: string,
    public readonly dto: CreateAssetRequestDto
  ) {}
}
