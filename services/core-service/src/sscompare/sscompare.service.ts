import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateThreadCommand } from "./commands/impl/create-thread.command"
import { Thread } from "./schemas/thread.schema"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { AppEventMap } from "@/shared/constants/app-events.map"
import { AIGenerationDto } from "./dto/ai-generate.dto"
import { FetchThreadByIdQuery } from "./queries/impl/fetch-thread-by-id.query"
import {
  TaxAdvisorStrategy,
  TaxAdvisorStrategyType,
} from "./sscompare.strategy"
import { User } from "@/auth/schemas/user.schema"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@Injectable()
export class TaxAdvisorService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly strategy: TaxAdvisorStrategy,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async getThreadById(threadId: string, isFirstMessage: boolean) {
    try {
      if (isFirstMessage) {
        return []
      }

      const thread = await this.queryBus.execute<
        FetchThreadByIdQuery,
        Thread[]
      >(new FetchThreadByIdQuery(threadId))
      if (!!thread && thread.length) {
        return thread
      } else {
        throw new Error("Thread not found")
      }
    } catch (error) {
      throw error
    }
  }

  async generateRecommendation(
    aiGenerationDto: AIGenerationDto,
    userId: string
  ) {
    try {
      const { prompt } = aiGenerationDto
      const threadId =
        aiGenerationDto.threadId ?? createOrConvertObjectId().toString()
      const thread = await this.getThreadById(
        threadId,
        !aiGenerationDto.threadId
      )

      const user: User = (
        await this.eventEmitter.emitAsync(AppEventMap.GetUserDetails, userId)
      ).shift()

      const args: TaxAdvisorStrategyType = {
        temperature: 0.8,
        topP: 0.8,
        thread,
        prompt,
        threadId,
        user,
      }

      const { response } = await this.strategy.advise(args)
      await this.commandBus.execute<CreateThreadCommand, Thread>(
        new CreateThreadCommand(String(user._id), threadId, prompt, response)
      )
      return { response, threadId }
    } catch (error) {
      throw error
    }
  }
}
