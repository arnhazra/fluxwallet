import { ExpenseCategory } from "@/shared/constants/types"
import { IsNumber, IsDateString, IsEnum, IsNotEmpty } from "class-validator"

export class CreateExpenseRequestDto {
  title?: string

  @IsNumber()
  expenseAmount: number

  @IsNotEmpty()
  @IsEnum(ExpenseCategory)
  expenseCategory: ExpenseCategory

  @IsDateString()
  expenseDate: Date
}
