import { IsNotEmpty } from "class-validator"

export class CreateAnalyticsDto {
  @IsNotEmpty()
  userId: string | null

  @IsNotEmpty()
  method: string

  @IsNotEmpty()
  apiUri: string
}
