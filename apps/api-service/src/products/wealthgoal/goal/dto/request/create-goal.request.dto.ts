import { IsNumber, IsDateString } from "class-validator"

export class CreateGoalRequestDto {
  @IsDateString()
  goalDate: Date

  @IsNumber()
  goalAmount: number
}
