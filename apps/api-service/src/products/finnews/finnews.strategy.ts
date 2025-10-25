import { Injectable } from "@nestjs/common"
import { config } from "@/config"
import { ChatOpenAI } from "@langchain/openai"
import { createAgent } from "langchain"
import { RedisService } from "@/shared/redis/redis.service"
import { NewsSummarizeReqParams } from "./finnews.service"

@Injectable()
export class FinNewsStrategy {
  constructor(private readonly redisService: RedisService) {}

  private async getSummarizerSystemInstruction() {
    const data = await this.redisService.get(
      "news-summarizer-system-instruction"
    )
    const content = data.replaceAll("{appName}", config.APP_NAME)

    return content
  }

  private async runNewsSummarizeAgent(llm: any, args: NewsSummarizeReqParams) {
    const systemInstruction = await this.getSummarizerSystemInstruction()

    const summarizeAgent = createAgent({
      model: llm,
    })

    const { messages } = await summarizeAgent.invoke({
      messages: [
        { role: "system", content: systemInstruction },
        {
          role: "user",
          content: `Summarize news - title: ${args.title}, description ${args.description}, content: ${args.content}`,
        },
      ],
    })

    return messages[messages.length - 1]?.content.toString()
  }

  async newsSummarizeStrategy(args: NewsSummarizeReqParams) {
    const llm = new ChatOpenAI({
      model: config.DEFAULT_MODEL,
      temperature: args.temperature,
      topP: args.topP,
      apiKey: config.AZURE_OPENAI_API_KEY,
      configuration: {
        baseURL: config.AZURE_OPENAI_DEPLOYMENT_URI,
        apiKey: config.AZURE_OPENAI_API_KEY,
      },
    })
    const response = await this.runNewsSummarizeAgent(llm, args)
    return { response }
  }
}
