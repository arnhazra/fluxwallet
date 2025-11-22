import { IsEmail, IsNotEmpty } from "class-validator"

export class VerifyOTPDto {
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  readonly otp: string

  readonly name?: string
}
