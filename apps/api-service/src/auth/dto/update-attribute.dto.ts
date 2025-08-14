import { Currency } from "@/shared/constants/types"
import { IsNotEmpty } from "class-validator"
import { User } from "../schemas/user.schema"

export class UpdateAttributeDto {
  @IsNotEmpty()
  readonly attributeName: keyof User

  @IsNotEmpty()
  readonly attributeValue: string | number | boolean | null | Currency
}
