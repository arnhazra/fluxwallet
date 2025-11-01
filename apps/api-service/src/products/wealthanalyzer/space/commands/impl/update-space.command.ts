import { CreateSpaceRequestDto } from "../../dto/request/create-space.request.dto"

export class UpdateSpaceCommand {
  constructor(
    public readonly userId: string,
    public readonly spaceId: string,
    public readonly dto: CreateSpaceRequestDto
  ) {}
}
