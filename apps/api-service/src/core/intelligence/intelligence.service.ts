import { BadRequestException, Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateThreadCommand } from "./commands/impl/create-thread.command"
import { Thread } from "./schemas/thread.schema"
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter"
import { EventsUnion } from "@/shared/utils/events.union"
import { AIGenerationDto } from "./dto/ai-generate.dto"
import { Types } from "mongoose"
import { FetchThreadByIdQuery } from "./queries/impl/fetch-thread-by-id.query"
import { GetUsageByUserIdQuery } from "./queries/impl/get-usage-by-user-id.query"
import {
  IntelligenceStrategy,
  IntelligenceStrategyType,
} from "./intelligence.strategy"
import { User } from "../user/schemas/user.schema"

@Injectable()
export class IntelligenceService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly strategy: IntelligenceStrategy,
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
        throw new BadRequestException("Thread not found")
      }
    } catch (error) {
      throw error
    }
  }

  @OnEvent(EventsUnion.GetThreadCount)
  async getTodaysUsageByUserId(userId: string) {
    try {
      return await this.queryBus.execute<GetUsageByUserIdQuery, number>(
        new GetUsageByUserIdQuery(userId)
      )
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
        aiGenerationDto.threadId ?? new Types.ObjectId().toString()
      const thread = await this.getThreadById(
        threadId,
        !aiGenerationDto.threadId
      )

      const user: User = (
        await this.eventEmitter.emitAsync(EventsUnion.GetUserDetails, {
          _id: userId,
        })
      ).shift()

      const args: IntelligenceStrategyType = {
        genericName: "openai/gpt-4o-mini",
        temperature: 1.0,
        topP: 1.0,
        thread,
        prompt,
        threadId,
        user,
      }
      const { response } = await this.strategy.azureStrategy(args)
      await this.commandBus.execute<CreateThreadCommand, Thread>(
        new CreateThreadCommand(String(user.id), threadId, prompt, response)
      )
      return { response, threadId }
    } catch (error) {
      throw error
    }
  }
}
