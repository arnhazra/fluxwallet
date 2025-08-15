import { PartialType } from "@nestjs/mapped-types"
import { RequestOTPDto } from "./request-otp.dto"
import { IsNotEmpty } from "class-validator"

export class VerifyOTPDto extends PartialType(RequestOTPDto) {
  @IsNotEmpty()
  readonly otp: string

  @IsNotEmpty()
  readonly hash: string

  readonly name?: string
}
