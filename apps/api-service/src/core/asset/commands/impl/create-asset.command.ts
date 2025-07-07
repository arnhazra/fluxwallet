import { CreateAssetRequestDto } from "../../dto/request/create-asset.request.dto"

export class CreateAssetCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: CreateAssetRequestDto
  ) {}
}
