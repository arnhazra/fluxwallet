import { Injectable } from "@nestjs/common"
import { Thread } from "./schemas/thread.schema"
import { config } from "@/config"
import { ChatOpenAI } from "@langchain/openai"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { LanguageModelLike } from "@langchain/core/language_models/base"
import { chatSystemPrompt } from "./data/chat-system-prompt"
import { User } from "@/auth/schemas/user.schema"
import { ChatTools } from "./tools/chat.tool"
import { EntityType } from "./dto/ai-summarize.dto"
import { AIModel } from "./dto/ai-chat.dto"
import { SummarizeTools } from "./tools/summarize.tool"
import { summarizeSystemPrompt } from "./data/summarize-system-prompt"

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
    private readonly summarizeTools: SummarizeTools
  ) {}

  private async runChatTools(llm: LanguageModelLike, args: ChatReqParams) {
    const { thread, prompt, user } = args

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
      ],
    })

    const chatHistory = thread.flatMap((t) => [
      { role: "user", content: t.prompt },
      { role: "assistant", content: t.response },
    ])

    const { messages } = await chatAgent.invoke({
      messages: [
        { role: "system", content: chatSystemPrompt(user) },
        ...chatHistory,
        { role: "user", content: prompt },
      ],
    })

    return messages[messages.length - 1]?.content.toString()
  }

  async azureChatStrategy(args: ChatReqParams) {
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
    const response = await this.runChatTools(llm, args)
    return { response }
  }

  async googleChatStrategy(args: ChatReqParams) {
    const llm = new ChatGoogleGenerativeAI({
      model: args.genericName,
      temperature: args.temperature,
      topP: args.topP,
      apiKey: config.GCP_API_KEY,
    })
    const response = await this.runChatTools(llm, args)
    return { response }
  }

  private async runSummarizeAgent(
    llm: LanguageModelLike,
    args: SummarizeReqParams
  ) {
    const { entityId, entityType, user } = args

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
        { role: "system", content: summarizeSystemPrompt(user) },
        {
          role: "user",
          content: `Summarize entity type: ${entityType} and id is ${entityId}`,
        },
      ],
    })

    return messages[messages.length - 1]?.content.toString()
  }

  async summarizeStrategy(args: SummarizeReqParams) {
    const llm = new ChatGoogleGenerativeAI({
      model: AIModel.Gemini,
      temperature: args.temperature,
      topP: args.topP,
      apiKey: config.GCP_API_KEY,
    })
    const response = await this.runSummarizeAgent(llm, args)
    return { response }
  }
}
