import { Injectable } from "@nestjs/common"
import { Thread } from "./schemas/thread.schema"
import { config } from "@/config"
import { ChatOpenAI } from "@langchain/openai"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { LanguageModelLike } from "@langchain/core/language_models/base"
import { chatSystemPrompt } from "./data/chat-system-prompt"
import { User } from "@/auth/schemas/user.schema"
import { ChatAgent } from "./agents/chat.agent"
import { EntityType } from "./dto/ai-summarize.dto"
import { AIModel } from "./dto/ai-chat.dto"
import { SummarizeAgent } from "./agents/summarize.agent"
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
    private readonly chatAgent: ChatAgent,
    private readonly summarizeAgent: SummarizeAgent
  ) {}

  private async runChatAgent(llm: LanguageModelLike, args: ChatReqParams) {
    const { thread, prompt, user } = args

    const agent = createReactAgent({
      llm,
      tools: [
        this.chatAgent.getTotalWealthAgent,
        this.chatAgent.createInstitutionAgent,
        this.chatAgent.getInstitutionValuationAgent,
        this.chatAgent.getInstitutionListAgent,
        this.chatAgent.changeBaseCurrencyAgent,
        this.chatAgent.sendEmailAgent,
        this.chatAgent.getAssetListAgent,
      ],
    })

    const chatHistory = thread.flatMap((t) => [
      { role: "user", content: t.prompt },
      { role: "assistant", content: t.response },
    ])

    const { messages } = await agent.invoke({
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
    const response = await this.runChatAgent(llm, args)
    return { response }
  }

  async googleChatStrategy(args: ChatReqParams) {
    const llm = new ChatGoogleGenerativeAI({
      model: args.genericName,
      temperature: args.temperature,
      topP: args.topP,
      apiKey: config.GCP_API_KEY,
    })
    const response = await this.runChatAgent(llm, args)
    return { response }
  }

  private async runSummarizeAgent(
    llm: LanguageModelLike,
    args: SummarizeReqParams
  ) {
    const { entityId, entityType, user } = args

    const agent = createReactAgent({
      llm,
      tools: [
        this.summarizeAgent.getInstitutionAgent,
        this.summarizeAgent.getAssetAgent,
        this.summarizeAgent.getDebtAgent,
        this.summarizeAgent.getGoalAgent,
      ],
    })

    const { messages } = await agent.invoke({
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
