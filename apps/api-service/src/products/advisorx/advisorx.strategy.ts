import { Injectable } from "@nestjs/common"
import { Thread } from "./schemas/thread.schema"
import { config } from "@/config"
import { ChatOpenAI } from "@langchain/openai"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { LanguageModelLike } from "@langchain/core/language_models/base"
import { systemPrompt } from "./data/system-prompt"
import { User } from "@/auth/schemas/user.schema"
import { AdvisorXAgent } from "./advisorx.agent"

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
  constructor(private readonly agent: AdvisorXAgent) {}

  private async runAgent(llm: LanguageModelLike, args: AdvisorXStrategyType) {
    const { thread, prompt, user } = args

    const agent = createReactAgent({
      llm,
      tools: [
        this.agent.getTotalWealthAgent,
        this.agent.createInstitutionAgent,
        this.agent.getInstitutionValuationAgent,
        this.agent.getInstitutionListAgent,
        this.agent.changeBaseCurrencyAgent,
        this.agent.updateLiabilityAgent,
        this.agent.updateWealthGoalAgent,
        this.agent.sendEmailAgent,
        this.agent.getAssetListAgent,
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

  private buildAzureLLM(opts: AdvisorXStrategyType) {
    return new ChatOpenAI({
      model: opts.genericName,
      temperature: opts.temperature,
      topP: opts.topP,
      apiKey: config.AZURE_API_KEY,
      configuration: {
        baseURL: config.AZURE_DEPLOYMENT_URI,
        apiKey: config.AZURE_API_KEY,
      },
    })
  }

  private buildGoogleLLM(opts: AdvisorXStrategyType) {
    return new ChatGoogleGenerativeAI({
      model: opts.genericName,
      temperature: opts.temperature,
      topP: opts.topP,
      apiKey: config.GCP_API_KEY,
    })
  }

  async azureStrategy(args: AdvisorXStrategyType) {
    const llm = this.buildAzureLLM(args)
    const response = await this.runAgent(llm, args)
    return { response }
  }

  async googleStrategy(args: AdvisorXStrategyType) {
    const llm = this.buildGoogleLLM(args)
    const response = await this.runAgent(llm, args)
    return { response }
  }
}
