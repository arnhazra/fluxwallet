import { IsNotEmpty } from "class-validator"

export enum AIModel {
  GPT = "openai/gpt-4o-mini",
  Gemini = "gemini-2.5-flash-lite",
}

export class AIChatDto {
  @IsNotEmpty()
  prompt: string

  @IsNotEmpty()
  model: AIModel

  threadId: string
}
