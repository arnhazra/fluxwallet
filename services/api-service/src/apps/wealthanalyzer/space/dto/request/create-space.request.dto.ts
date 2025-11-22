import { IsNotEmpty } from "class-validator"

export class CreateSpaceRequestDto {
  @IsNotEmpty()
  spaceName: string
}
