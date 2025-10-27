import { Injectable } from "@nestjs/common"
import { Thread } from "./schemas/thread.schema"
import { config } from "@/config"
import { ChatOpenAI } from "@langchain/openai"
import { createAgent } from "langchain"
import { User } from "@/auth/schemas/user.schema"
import { ChatTools } from "./tools/chat.tool"
import { EntityType } from "./dto/summarize.dto"
import { SummarizeTools } from "./tools/summarize.tool"
import { RedisService } from "@/shared/redis/redis.service"

export interface ChatReqParams {
  temperature: number
  topP: number
  thread: Thread[]
  prompt: string
  threadId: string
  user: User
}

export interface SummarizeReqParams {
  entityId: string
  entityType: EntityType
  newsTitle: string | null | undefined
  newsDescription: string | null | undefined
  newsContent: string | null | undefined
  temperature: number
  topP: number
  user: User
}

@Injectable()
export class IntelligenceStrategy {
  constructor(
    private readonly chatTools: ChatTools,
    private readonly summarizeTools: SummarizeTools,
    private readonly redisService: RedisService
  ) {}

  private async getChatSystemInstruction(user: User) {
    const data = await this.redisService.get("chat-system-instruction")
    const content = data
      .replaceAll("{appName}", config.APP_NAME)
      .replaceAll("{userName}", user.name)
      .replaceAll("{userId}", user.id)
      .replaceAll("{userEmail}", user.email)
      .replaceAll("{baseCurrency}", user.baseCurrency)

    return content
  }

  private async getSummarizerSystemInstruction(
    user: User,
    entityType: EntityType
  ) {
    if (entityType === EntityType.NEWS) {
      const data = await this.redisService.get(
        "news-summarizer-system-instruction"
      )
      const content = data.replaceAll("{appName}", config.APP_NAME)
      return content
    } else {
      const data = await this.redisService.get("summarizer-system-instruction")
      const content = data
        .replaceAll("{appName}", config.APP_NAME)
        .replaceAll("{userId}", user.id)
        .replaceAll("{baseCurrency}", user.baseCurrency)
      return content
    }
  }

  private async runChatAgent(llm: any, args: ChatReqParams) {
    const { thread, prompt, user } = args
    const systemInstruction = await this.getChatSystemInstruction(user)

    const chatAgent = createAgent({
      model: llm,
      tools: [
        this.chatTools.getInstitutionTypesTool,
        this.chatTools.getAssetTypesTool,
        this.chatTools.getTotalWealthTool,
        this.chatTools.createInstitutionTool,
        this.chatTools.getInstitutionValuationTool,
        this.chatTools.getInstitutionListTool,
        this.chatTools.changeBaseCurrencyTool,
        this.chatTools.sendEmailTool,
        this.chatTools.getAssetListTool,
        this.chatTools.getGoalListTool,
        this.chatTools.getDebtListTool,
        this.chatTools.getNearestGoalTool,
        this.chatTools.getTotalDebtTool,
        this.chatTools.createDebtTool,
        this.chatTools.createGoalTool,
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

  private async runSummarizeAgent(llm: any, args: SummarizeReqParams) {
    const { entityId, entityType, user } = args
    const systemInstruction = await this.getSummarizerSystemInstruction(
      user,
      entityType
    )

    const summarizeAgent = createAgent({
      model: llm,
      tools: [
        this.summarizeTools.getInstitutionTool,
        this.summarizeTools.getAssetTool,
        this.summarizeTools.getDebtTool,
        this.summarizeTools.getGoalTool,
      ],
    })

    const { messages } = await summarizeAgent.invoke({
      messages: [
        { role: "system", content: systemInstruction },
        {
          role: "user",
          content:
            entityType === EntityType.NEWS
              ? `Summarize news - title: ${args.newsTitle}, description ${args.newsDescription}, content: ${args.newsContent}`
              : `Summarize entity type: ${entityType} and id is ${entityId}`,
        },
      ],
    })

    return messages[messages.length - 1]?.content.toString()
  }

  async summarizeStrategy(args: SummarizeReqParams) {
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
    const response = await this.runSummarizeAgent(llm, args)
    return { response }
  }
}
