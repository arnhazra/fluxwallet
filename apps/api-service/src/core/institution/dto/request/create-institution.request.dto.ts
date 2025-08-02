import { InstitutionType } from "@/shared/constants/types"
import { IsNotEmpty } from "class-validator"

export class CreateInstitutionRequestDto {
  @IsNotEmpty()
  institutionName: string

  @IsNotEmpty()
  institutionType: InstitutionType
}
