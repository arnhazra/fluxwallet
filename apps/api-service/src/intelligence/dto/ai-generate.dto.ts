import { IsNotEmpty } from "class-validator"

export class AIGenerationDto {
  messages: {
    role: string
    content: string
    parts: [
      {
        type: "text"
        text: string
      },
    ]
  }[]
}
