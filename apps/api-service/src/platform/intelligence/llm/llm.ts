import { config } from "@/config"
import { ChatOpenAI } from "@langchain/openai"

export const llm = new ChatOpenAI({
  model: config.AZURE_OPENAI_BASE_MODEL,
  temperature: 0.8,
  topP: 0.8,
  apiKey: config.AZURE_OPENAI_API_KEY,
  configuration: {
    baseURL: config.AZURE_OPENAI_DEPLOYMENT_URI,
    apiKey: config.AZURE_OPENAI_API_KEY,
  },
})
