import { Injectable } from "@nestjs/common"
import { Thread } from "./schemas/thread.schema"
import { config } from "@/config"
import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { LanguageModelLike } from "@langchain/core/language_models/base"
import { User } from "@/auth/schemas/user.schema"
import { RedisService } from "@/shared/redis/redis.service"
import { TaxAdvisorTools } from "./tools/taxadvisor.tool"

export interface TaxAdvisorStrategyType {
  genericName: string
  temperature: number
  topP: number
  thread: Thread[]
  prompt: string
  threadId: string
  user: User
}

@Injectable()
export class TaxAdvisorStrategy {
  constructor(
    private readonly redisService: RedisService,
    private readonly taxAdvisorTools: TaxAdvisorTools
  ) {}

  private async getSystemInstruction(user: User) {
    const data = await this.redisService.get("taxadvisor-system-instruction")
    return PromptTemplate.fromTemplate(data).invoke({
      appName: config.APP_NAME,
      userName: user.name,
      userId: user.id,
      userEmail: user.email,
      baseCurrency: user.baseCurrency,
    })
  }

  private async runAdvisorAgent(
    llm: LanguageModelLike,
    args: TaxAdvisorStrategyType
  ) {
    const { thread, prompt, user } = args
    const systemInstruction = await this.getSystemInstruction(user)

    const agent = createReactAgent({
      llm,
      tools: [this.taxAdvisorTools.sendEmailTool],
    })

    const chatHistory = thread.flatMap((t) => [
      { role: "user", content: t.prompt },
      { role: "assistant", content: t.response },
    ])

    const { messages } = await agent.invoke({
      messages: [
        { role: "system", content: systemInstruction.value },
        ...chatHistory,
        { role: "user", content: prompt },
      ],
    })

    return messages[messages.length - 1]?.content.toString()
  }

  async azureStrategy(args: TaxAdvisorStrategyType) {
    const llm = new ChatOpenAI({
      model: args.genericName,
      temperature: args.temperature,
      topP: args.topP,
      apiKey: config.AZURE_API_KEY,
      configuration: {
        baseURL: config.AZURE_DEPLOYMENT_URI,
        apiKey: config.AZURE_API_KEY,
      },
    })
    const response = await this.runAdvisorAgent(llm, args)
    return { response }
  }

  async googleStrategy(args: TaxAdvisorStrategyType) {
    const llm = new ChatGoogleGenerativeAI({
      model: args.genericName,
      temperature: args.temperature,
      topP: args.topP,
      apiKey: config.GCP_API_KEY,
    })
    const response = await this.runAdvisorAgent(llm, args)
    return { response }
  }
}
