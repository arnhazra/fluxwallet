import { Injectable } from "@nestjs/common"
import { Thread } from "../schemas/thread.schema"
import { config } from "@/config"
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai"
import { createAgent, SystemMessage, HumanMessage, AIMessage } from "langchain"
import { User } from "@/auth/schemas/user.schema"
import { ChatAgent } from "../agents/chat.agent"
import { RedisService } from "@/shared/redis/redis.service"
import { llm } from "../llm/llm"

export interface ChatArgs {
  thread: Thread[]
  prompt: string
  user: User
}

@Injectable()
export class ChatStrategy {
  constructor(
    private readonly chatAgent: ChatAgent,
    private readonly redisService: RedisService
  ) {}

  private async getChatSystemInstruction(user: User) {
    const data = await this.redisService.get("chat-system-instruction")
    const productConfig = await this.redisService.get("product-config")
    const solutionConfig = await this.redisService.get("solution-config")

    return data
      .replaceAll("{appName}", config.APP_NAME)
      .replaceAll("{userDetails}", JSON.stringify(user))
      .replaceAll("{productList}", productConfig)
      .replaceAll("{solutionList}", solutionConfig)
  }

  private async runChatAgent(
    llm: ChatOpenAI<ChatOpenAICallOptions>,
    args: ChatArgs
  ) {
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
      new HumanMessage(t.prompt),
      new AIMessage(t.response),
    ])

    const { messages } = await chatAgent.invoke({
      messages: [
        new SystemMessage(systemInstruction),
        ...chatHistory,
        new HumanMessage(prompt),
      ],
    })

    return messages[messages.length - 1]?.content.toString()
  }

  async chat(args: ChatArgs) {
    const response = await this.runChatAgent(llm, args)
    return { response }
  }
}
