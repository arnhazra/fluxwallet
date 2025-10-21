import { Injectable } from "@nestjs/common"
import { Thread } from "./schemas/thread.schema"
import { config } from "@/config"
import { ChatOpenAI } from "@langchain/openai"
import { createAgent } from "langchain"
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
    const content = data
      .replaceAll("{appName}", config.APP_NAME)
      .replaceAll("{userName}", user.name)
      .replaceAll("{userId}", user.id)
      .replaceAll("{userEmail}", user.email)
      .replaceAll("{baseCurrency}", user.baseCurrency)
    return content
  }

  private async runAdvisorAgent(llm: any, args: TaxAdvisorStrategyType) {
    const { thread, prompt, user } = args
    const systemInstruction = await this.getSystemInstruction(user)

    const agent = createAgent({
      model: llm,
      tools: [this.taxAdvisorTools.sendEmailTool],
    })

    const chatHistory = thread.flatMap((t) => [
      { role: "user", content: t.prompt },
      { role: "assistant", content: t.response },
    ])

    const { messages } = await agent.invoke({
      messages: [
        { role: "system", content: systemInstruction },
        ...chatHistory,
        { role: "user", content: prompt },
      ],
    })

    return messages[messages.length - 1]?.content.toString()
  }

  async taxAdvisorStrategy(args: TaxAdvisorStrategyType) {
    const llm = new ChatOpenAI({
      model: args.genericName,
      temperature: args.temperature,
      topP: args.topP,
      apiKey: config.AZURE_OPENAI_API_KEY,
      configuration: {
        baseURL: config.AZURE_OPENAI_DEPLOYMENT_URI,
        apiKey: config.AZURE_OPENAI_API_KEY,
      },
    })
    const response = await this.runAdvisorAgent(llm, args)
    return { response }
  }
}
