import { ExpenseCategory } from "@/shared/constants/types"
import { IsOptional, IsString, IsEnum } from "class-validator"

export class FindMyExpensesQueryDto {
  @IsOptional()
  @IsString()
  month?: string

  @IsOptional()
  @IsString()
  searchKeyword?: string

  @IsOptional()
  @IsEnum(ExpenseCategory)
  category?: ExpenseCategory
}
