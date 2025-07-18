import { Currency, InstitutionType } from "@/shared/constants/types"
import { IsNotEmpty } from "class-validator"

export class CreatePortfolioRequestDto {
  @IsNotEmpty()
  portfolioName: string

  @IsNotEmpty()
  institutionType: InstitutionType

  @IsNotEmpty()
  baseCurrency: Currency
}
