import { Injectable } from "@nestjs/common"
import { Thread } from "./schemas/thread.schema"
import { config } from "@/config"
import { ChatOpenAI } from "@langchain/openai"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { LanguageModelLike } from "@langchain/core/language_models/base"
import { systemPrompt } from "./data/system-prompt"
import { User } from "@/auth/schemas/user.schema"
import { AdvisorXTools } from "./advisorx.tool"

export interface AdvisorXStrategyType {
  genericName: string
  temperature: number
  topP: number
  thread: Thread[]
  prompt: string
  threadId: string
  user: User
}

@Injectable()
export class AdvisorXStrategy {
  constructor(private readonly tools: AdvisorXTools) {}

  private async runAdvisorAgent(
    llm: LanguageModelLike,
    args: AdvisorXStrategyType
  ) {
    const { thread, prompt, user } = args

    const agent = createReactAgent({
      llm,
      tools: [
        this.tools.getTotalWealthTool,
        this.tools.getTotalDebtTool,
        this.tools.getInstitutionValuationTool,
        this.tools.getInstitutionListTool,
        this.tools.getAssetListTool,
        this.tools.getDebtListTool,
        this.tools.getGoalListTool,
        this.tools.getNearestGoalTool,
      ],
    })

    const chatHistory = thread.flatMap((t) => [
      { role: "user", content: t.prompt },
      { role: "assistant", content: t.response },
    ])

    const { messages } = await agent.invoke({
      messages: [
        { role: "system", content: systemPrompt(user) },
        ...chatHistory,
        { role: "user", content: prompt },
      ],
    })

    return messages[messages.length - 1]?.content.toString()
  }

  async azureStrategy(args: AdvisorXStrategyType) {
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
    const response = await this.runAdvisorAgent(llm, args)
    return { response }
  }

  async googleStrategy(args: AdvisorXStrategyType) {
    const llm = new ChatGoogleGenerativeAI({
      model: args.genericName,
      temperature: args.temperature,
      topP: args.topP,
      apiKey: config.GCP_API_KEY,
    })
    const response = await this.runAdvisorAgent(llm, args)
    return { response }
  }
}
