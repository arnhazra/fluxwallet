import { IsNotEmpty } from "class-validator"

export enum AIModel {
  Gemini = "gemini-2.5-flash-lite",
  GPT = "openai/gpt-4o-mini",
}

export class AIGenerationDto {
  @IsNotEmpty()
  prompt: string

  @IsNotEmpty()
  model: AIModel

  threadId: string
}
