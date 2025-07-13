import { Injectable } from "@nestjs/common"
import { Thread } from "./schemas/thread.schema"
import { config } from "@/config"
import { ChatOpenAI } from "@langchain/openai"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { LanguageModelLike } from "@langchain/core/language_models/base"
import { systemPrompt } from "./helpers/prompts/system-prompt"
import { getTotalValuation } from "./helpers/tools/get-total-valuation.tool"
import { getPortfolioValuation } from "./helpers/tools/get-portfolio-valuation.tool"
import { User } from "../user/schemas/user.schema"

export interface IntelligenceStrategyType {
  genericName: string
  temperature: number
  topP: number
  thread: Thread[]
  prompt: string
  threadId: string
  user: User
}

@Injectable()
export class IntelligenceStrategy {
  private async runAgent(
    llm: LanguageModelLike,
    args: IntelligenceStrategyType
  ) {
    const { thread, prompt, user } = args

    const agent = createReactAgent({
      llm,
      tools: [getTotalValuation, getPortfolioValuation],
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

  private buildAzureLLM(opts: IntelligenceStrategyType) {
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

  async azureStrategy(args: IntelligenceStrategyType) {
    const llm = this.buildAzureLLM(args)
    const response = await this.runAgent(llm, args)
    return { response }
  }
}
