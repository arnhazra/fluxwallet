import { Injectable } from "@nestjs/common"
import { Thread } from "./schemas/thread.schema"
import { config } from "@/config"
import { createAgent } from "langchain"
import { User } from "@/auth/schemas/user.schema"
import { RedisService } from "@/shared/redis/redis.service"
import { TaxAdvisorAgent } from "./agents/taxadvisor.agent"
import { LLMService } from "@/shared/llm/llm.service"

export interface TaxAdvisorStrategyType {
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
    private readonly taxAdvisorAgent: TaxAdvisorAgent,
    private readonly llmService: LLMService
  ) {}

  private async getSystemInstruction(user: User) {
    const data = await this.redisService.get("taxadvisor-system-instruction")
    const content = data
      .replaceAll("{platformName}", config.PLATFORM_NAME)
      .replaceAll("{todaysDate}", new Date().toString())
      .replaceAll("{userDetails}", JSON.stringify(user))
    return content
  }

  private async runAdvisorAgent(llm: any, args: TaxAdvisorStrategyType) {
    const { thread, prompt, user } = args
    const systemInstruction = await this.getSystemInstruction(user)

    const agent = createAgent({
      model: llm,
      tools: [this.taxAdvisorAgent.sendEmailTool],
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

  async advise(args: TaxAdvisorStrategyType) {
    const llm = this.llmService.getLLM()
    const response = await this.runAdvisorAgent(llm, args)
    return { response }
  }
}
