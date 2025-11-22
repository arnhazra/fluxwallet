import { IsNotEmpty, IsNumber, IsString, IsDateString } from "class-validator"

export class CreateDebtRequestDto {
  @IsNotEmpty()
  @IsString()
  debtPurpose: string

  @IsNotEmpty()
  @IsString()
  identifier: string

  @IsDateString()
  startDate: Date

  @IsDateString()
  endDate: Date

  @IsNumber()
  principalAmount: number

  @IsNumber()
  interestRate: number
}
