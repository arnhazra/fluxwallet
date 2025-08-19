import { CreateInstitutionRequestDto } from "../../dto/request/create-institution.request.dto"

export class CreateInstitutionCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: CreateInstitutionRequestDto
  ) {}
}
