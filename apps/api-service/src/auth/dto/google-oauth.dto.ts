import { IsNotEmpty } from "class-validator"

export class GoogleOAuthDto {
  @IsNotEmpty()
  readonly token: string
}
