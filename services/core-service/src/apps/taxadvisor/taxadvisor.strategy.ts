import { Injectable } from "@nestjs/common"
import { Thread } from "./schemas/thread.schema"
import { config } from "@/config"
import { AIMessage, createAgent, HumanMessage, SystemMessage } from "langchain"
import { User } from "@/auth/schemas/user.schema"
import { RedisService } from "@/shared/redis/redis.service"
import { TaxAdvisorAgent } from "./agents/taxadvisor.agent"
import { LLMService } from "@/shared/llm/llm.service"
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai"

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

  private async runAdvisorAgent(
    llm: ChatOpenAI<ChatOpenAICallOptions>,
    args: TaxAdvisorStrategyType
  ) {
    const { thread, prompt, user } = args
    const systemInstruction = await this.getSystemInstruction(user)

    const agent = createAgent({
      model: llm,
      tools: [this.taxAdvisorAgent.sendEmailTool],
      stateSchema: undefined,
    })

    const chatHistory = thread.flatMap((t) => [
      new HumanMessage(t.prompt),
      new AIMessage(t.response),
    ])

    const { messages } = await agent.invoke({
      messages: [
        new SystemMessage(systemInstruction),
        ...chatHistory,
        new HumanMessage(prompt),
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
