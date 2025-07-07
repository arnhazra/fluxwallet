import { Injectable } from "@nestjs/common"
import { Thread } from "./schemas/thread.schema"
import { config } from "@/config"
import { ChatOpenAI } from "@langchain/openai"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { LanguageModelLike } from "@langchain/core/language_models/base"
import { MemorySaver } from "@langchain/langgraph"

export interface IntelligenceStrategyType {
  genericName: string
  temperature: number
  topP: number
  thread: Thread[]
  prompt: string
  threadId: string
}

@Injectable()
export class IntelligenceStrategy {
  private async runAgent(
    llm: LanguageModelLike,
    args: IntelligenceStrategyType
  ) {
    const { thread, prompt, threadId } = args
    const memory = new MemorySaver()

    const agent = createReactAgent({
      llm,
      tools: [],
      checkpointSaver: memory,
    })

    const chatHistory = thread.flatMap((t) => [
      { role: "user", content: t.prompt },
      { role: "assistant", content: t.response },
    ])

    const { messages } = await agent.invoke(
      {
        messages: [...chatHistory, { role: "user", content: prompt }],
      },
      {
        configurable: {
          thread_id: threadId,
        },
      }
    )

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
