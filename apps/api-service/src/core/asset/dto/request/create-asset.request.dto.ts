import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDate,
  ValidateIf,
} from "class-validator"
import { AssetType, RecurringFrequency } from "@/shared/constants/types"

export class CreateAssetRequestDto {
  @IsNotEmpty()
  portfolioId: string

  @IsNotEmpty()
  @IsEnum(AssetType)
  assetType: AssetType

  @IsNotEmpty()
  @IsString()
  assetName: string

  @IsNotEmpty()
  @IsString()
  identifier: string

  @ValidateIf((o) =>
    [
      AssetType.FD,
      AssetType.RD,
      AssetType.MUTUAL_FUND,
      AssetType.SIP,
      AssetType.LUMPSUM,
    ].includes(o.assetType)
  )
  @IsDate()
  startDate?: Date

  @ValidateIf((o) =>
    [
      AssetType.FD,
      AssetType.RD,
      AssetType.MUTUAL_FUND,
      AssetType.SIP,
      AssetType.LUMPSUM,
    ].includes(o.assetType)
  )
  @IsDate()
  maturityDate?: Date

  @ValidateIf((o) =>
    [AssetType.FD, AssetType.MUTUAL_FUND, AssetType.LUMPSUM].includes(
      o.assetType
    )
  )
  @IsNumber()
  amountInvested?: number

  @ValidateIf((o) =>
    [
      AssetType.FD,
      AssetType.RD,
      AssetType.MUTUAL_FUND,
      AssetType.SIP,
      AssetType.LUMPSUM,
    ].includes(o.assetType)
  )
  @IsNumber()
  expectedReturnRate?: number

  @ValidateIf((o) => [AssetType.RD, AssetType.SIP].includes(o.assetType))
  @IsNumber()
  monthlyContribution?: number

  @ValidateIf((o) => [AssetType.RD, AssetType.SIP].includes(o.assetType))
  @IsEnum(RecurringFrequency)
  contributionFrequency?: RecurringFrequency

  @ValidateIf((o) =>
    [
      AssetType.PROPERTY,
      AssetType.BOND,
      AssetType.METAL,
      AssetType.OTHER,
    ].includes(o.assetType)
  )
  @IsNumber()
  valuationOnPurchase?: number

  @ValidateIf((o) =>
    [AssetType.EPF, AssetType.PPF, AssetType.CASH].includes(o.assetType)
  )
  @IsNumber()
  currentValuation?: number

  @ValidateIf((o) => [AssetType.EQUITY].includes(o.assetType))
  @IsNumber()
  units?: number

  @ValidateIf((o) => [AssetType.EQUITY].includes(o.assetType))
  @IsNumber()
  unitPurchasePrice?: number
}
