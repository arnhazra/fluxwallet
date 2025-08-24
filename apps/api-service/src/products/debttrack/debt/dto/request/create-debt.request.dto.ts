import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
} from "class-validator"
import { RecurringFrequency } from "@/shared/constants/types"

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
  amountOwe: number

  @IsNumber()
  interestRate: number

  @IsEnum(RecurringFrequency)
  returnFrequency: RecurringFrequency
}
