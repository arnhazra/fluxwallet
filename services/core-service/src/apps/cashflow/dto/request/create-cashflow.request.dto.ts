import { IsNumber, IsNotEmpty, IsEnum, IsDateString } from "class-validator"
import { FlowDirection, FlowFrequency } from "../../schemas/cashflow.schema"

export class CreateCashFlowRequestDto {
  @IsNotEmpty()
  description: string

  @IsNotEmpty()
  targetAsset: string

  @IsEnum(FlowDirection)
  flowDirection: FlowDirection

  @IsNumber()
  amount: number

  @IsEnum(FlowFrequency)
  frequency: FlowFrequency

  @IsDateString()
  nextExecutionAt?: Date
}
