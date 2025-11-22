import { IsEmail } from "class-validator"

export class RequestOTPDto {
  @IsEmail()
  readonly email: string
}
