import { CreateInstitutionRequestDto } from "../../dto/request/create-institution.request.dto"

export class UpdateInstitutionCommand {
  constructor(
    public readonly userId: string,
    public readonly institutionId: string,
    public readonly dto: CreateInstitutionRequestDto
  ) {}
}
