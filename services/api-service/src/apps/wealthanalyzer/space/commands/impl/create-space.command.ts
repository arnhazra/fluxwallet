import { CreateSpaceRequestDto } from "../../dto/request/create-space.request.dto"

export class CreateSpaceCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: CreateSpaceRequestDto
  ) {}
}
