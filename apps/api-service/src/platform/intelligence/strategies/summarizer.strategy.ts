import { Injectable } from "@nestjs/common"
import { config } from "@/config"
import { ChatOpenAI } from "@langchain/openai"
import { createAgent } from "langchain"
import { User } from "@/auth/schemas/user.schema"
import { EntityType } from "../dto/summarize.dto"
import { SummarizeAgent } from "../agents/summarize.agent"
import { RedisService } from "@/shared/redis/redis.service"

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
export class SummarizerStrategy {
  constructor(
    private readonly summarizeTools: SummarizeAgent,
    private readonly redisService: RedisService
  ) {}

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

  private async runSummarizeAgent(llm: any, args: SummarizeReqParams) {
    const { entityId, entityType, user } = args
    const systemInstruction = await this.getSummarizerSystemInstruction(
      user,
      entityType
    )

    const summarizeAgent = createAgent({
      model: llm,
      tools: [
        this.summarizeTools.getSpaceTool,
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
