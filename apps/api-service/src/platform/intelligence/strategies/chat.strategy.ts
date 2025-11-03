import { Injectable } from "@nestjs/common"
import { Thread } from "../schemas/thread.schema"
import { config } from "@/config"
import { ChatOpenAI } from "@langchain/openai"
import { createAgent } from "langchain"
import { User } from "@/auth/schemas/user.schema"
import { ChatAgent } from "../agents/chat.agent"
import { RedisService } from "@/shared/redis/redis.service"

export interface ChatReqParams {
  temperature: number
  topP: number
  thread: Thread[]
  prompt: string
  threadId: string
  user: User
}

@Injectable()
export class ChatStrategy {
  constructor(
    private readonly chatAgent: ChatAgent,
    private readonly redisService: RedisService
  ) {}

  private async getChatSystemInstruction(user: User) {
    const systemInstruction = await this.redisService.get(
      "chat-system-instruction"
    )
    const productConfig = await this.redisService.get("product-config")
    const solutionConfig = await this.redisService.get("solution-config")

    const content = systemInstruction
      .replaceAll("{appName}", config.APP_NAME)
      .replaceAll("{userDetails}", JSON.stringify(user))
      .replaceAll("{productList}", productConfig)
      .replaceAll("{solutionList}", solutionConfig)

    return content
  }

  private async runChatAgent(llm: any, args: ChatReqParams) {
    const { thread, prompt, user } = args
    const systemInstruction = await this.getChatSystemInstruction(user)

    const chatAgent = createAgent({
      model: llm,
      tools: [
        this.chatAgent.getAssetTypesTool,
        this.chatAgent.getTotalWealthTool,
        this.chatAgent.createSpaceTool,
        this.chatAgent.getSpaceValuationTool,
        this.chatAgent.getSpaceListTool,
        this.chatAgent.changeBaseCurrencyTool,
        this.chatAgent.sendEmailTool,
        this.chatAgent.getAssetListTool,
        this.chatAgent.getGoalListTool,
        this.chatAgent.getDebtListTool,
        this.chatAgent.getNearestGoalTool,
        this.chatAgent.getTotalDebtTool,
        this.chatAgent.createDebtTool,
        this.chatAgent.createGoalTool,
      ],
    })

    const chatHistory = thread.flatMap((t) => [
      { role: "user", content: t.prompt },
      { role: "assistant", content: t.response },
    ])

    const { messages } = await chatAgent.invoke({
      messages: [
        { role: "system", content: systemInstruction },
        ...chatHistory,
        { role: "user", content: prompt },
      ],
    })

    return messages[messages.length - 1]?.content.toString()
  }

  async chatStrategy(args: ChatReqParams) {
    const llm = new ChatOpenAI({
      model: config.AZURE_OPENAI_BASE_MODEL,
      temperature: args.temperature,
      topP: args.topP,
      apiKey: config.AZURE_OPENAI_API_KEY,
      configuration: {
        baseURL: config.AZURE_OPENAI_DEPLOYMENT_URI,
        apiKey: config.AZURE_OPENAI_API_KEY,
      },
    })
    const response = await this.runChatAgent(llm, args)
    return { response }
  }
}
