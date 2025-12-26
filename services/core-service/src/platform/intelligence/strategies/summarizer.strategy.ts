import { Injectable } from "@nestjs/common"
import { config } from "@/config"
import { User } from "@/auth/schemas/user.schema"
import { EntityType } from "../dto/summarize.dto"
import { RedisService } from "@/shared/redis/redis.service"
import { SystemMessage } from "langchain"
import { LLMService } from "@/shared/llm/llm.service"

export interface SummarizeArgs {
  entityType: EntityType
  entityDetails: string
  user: User
}

@Injectable()
export class SummarizerStrategy {
  constructor(
    private readonly redisService: RedisService,
    private readonly llmService: LLMService
  ) {}

  private async getSummarizerSystemInstruction(args: SummarizeArgs) {
    const data = await this.redisService.get("summarizer-system-instruction")
    return data
      .replaceAll("{platformName}", config.PLATFORM_NAME)
      .replaceAll("{userId}", String(args.user._id))
      .replaceAll("{baseCurrency}", args.user.baseCurrency)
      .replaceAll("{entityType}", args.entityType)
      .replaceAll("{entityDetails}", args.entityDetails)
  }

  async summarize(args: SummarizeArgs) {
    const llm = this.llmService.getLLM()
    const systemInstruction = await this.getSummarizerSystemInstruction(args)
    const message = [new SystemMessage(systemInstruction)]
    const response = await llm.invoke(message)
    return { response: response.content }
  }
}
