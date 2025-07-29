import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
  IsDateString,
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
  @IsDateString()
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
  @IsDateString()
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
  contributionAmount?: number

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
    [AssetType.EPF, AssetType.PPF, AssetType.CASH, AssetType.METAL].includes(
      o.assetType
    )
  )
  @IsNumber()
  currentValuation?: number

  @ValidateIf((o) => [AssetType.EQUITY, AssetType.CRYPTO].includes(o.assetType))
  @IsNumber()
  units?: number

  @ValidateIf((o) => [AssetType.EQUITY, AssetType.CRYPTO].includes(o.assetType))
  @IsNumber()
  unitPurchasePrice?: number
}
