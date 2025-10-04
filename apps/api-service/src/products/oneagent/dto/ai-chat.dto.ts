import { IsNotEmpty } from "class-validator"

export class AIChatDto {
  @IsNotEmpty()
  prompt: string

  @IsNotEmpty()
  model: string

  threadId: string
}
