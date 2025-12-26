import { Injectable } from "@nestjs/common"
import { config } from "@/config"
import { ChatOpenAI } from "@langchain/openai"

@Injectable()
export class LLMService {
  constructor() {}

  getLLM() {
    return new ChatOpenAI({
      model: config.GPT_OSS_MODEL_NAME,
      temperature: 0.8,
      topP: 0.8,
      apiKey: config.GPT_OSS_API_KEY,
      configuration: {
        baseURL: config.GPT_OSS_DEPLOYMENT_URI,
        apiKey: config.GPT_OSS_API_KEY,
      },
    })
  }
}
