import { Injectable } from "@nestjs/common"
import { Thread } from "./schemas/thread.schema"
import { config } from "@/config"
import { ChatOpenAI } from "@langchain/openai"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { LanguageModelLike } from "@langchain/core/language_models/base"
import { User } from "@/auth/schemas/user.schema"
import { ChatTools } from "./tools/chat.tool"
import { EntityType } from "./dto/ai-summarize.dto"
import { SummarizeTools } from "./tools/summarize.tool"
import { RedisService } from "@/shared/redis/redis.service"
import { PromptTemplate } from "@langchain/core/prompts"

export interface ChatReqParams {
  genericName: string
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
    return PromptTemplate.fromTemplate(data).invoke({
      appName: config.APP_NAME,
      userName: user.name,
      userId: user.id,
      userEmail: user.email,
      baseCurrency: user.baseCurrency,
    })
  }

  private async getSummarizerSystemInstruction(user: User) {
    const data = await this.redisService.get("summarizer-system-instruction")
    return PromptTemplate.fromTemplate(data).invoke({
      appName: config.APP_NAME,
      userId: user.id,
      baseCurrency: user.baseCurrency,
    })
  }

  private async runChatAgent(llm: LanguageModelLike, args: ChatReqParams) {
    const { thread, prompt, user } = args
    const systemInstruction = await this.getChatSystemInstruction(user)

    const chatAgent = createReactAgent({
      llm,
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
        { role: "system", content: systemInstruction.value },
        ...chatHistory,
        { role: "user", content: prompt },
      ],
    })

    return messages[messages.length - 1]?.content.toString()
  }

  async chatStrategy(args: ChatReqParams) {
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
    const response = await this.runChatAgent(llm, args)
    return { response }
  }

  private async runSummarizeAgent(
    llm: LanguageModelLike,
    args: SummarizeReqParams
  ) {
    const { entityId, entityType, user } = args
    const systemInstruction = await this.getSummarizerSystemInstruction(user)

    const summarizeAgent = createReactAgent({
      llm,
      tools: [
        this.summarizeTools.getInstitutionTool,
        this.summarizeTools.getAssetTool,
        this.summarizeTools.getDebtTool,
        this.summarizeTools.getGoalTool,
      ],
    })

    const { messages } = await summarizeAgent.invoke({
      messages: [
        { role: "system", content: systemInstruction.value },
        {
          role: "user",
          content: `Summarize entity type: ${entityType} and id is ${entityId}`,
        },
      ],
    })

    return messages[messages.length - 1]?.content.toString()
  }

  async summarizeStrategy(args: SummarizeReqParams) {
    const llm = new ChatOpenAI({
      model: config.DEFAULT_MODEL,
      temperature: args.temperature,
      topP: args.topP,
      apiKey: config.AZURE_API_KEY,
      configuration: {
        baseURL: config.AZURE_DEPLOYMENT_URI,
        apiKey: config.AZURE_API_KEY,
      },
    })
    const response = await this.runSummarizeAgent(llm, args)
    return { response }
  }
}
