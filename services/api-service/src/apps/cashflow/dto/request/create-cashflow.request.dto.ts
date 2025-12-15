import { IsNumber, IsDateString, IsNotEmpty, IsEnum } from "class-validator"
import { FlowDirection, FlowFrequency } from "../../schemas/cashflow.schema"

export class CreateCashFlowRequestDto {
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
