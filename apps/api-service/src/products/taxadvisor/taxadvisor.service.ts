import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateThreadCommand } from "./commands/impl/create-thread.command"
import { Thread } from "./schemas/thread.schema"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/constants/event.map"
import { AIGenerationDto } from "./dto/ai-generate.dto"
import { Types } from "mongoose"
import { FetchThreadByIdQuery } from "./queries/impl/fetch-thread-by-id.query"
import {
  TaxAdvisorStrategy,
  TaxAdvisorStrategyType,
} from "./taxadvisor.strategy"
import { User } from "@/auth/schemas/user.schema"

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
        aiGenerationDto.threadId ?? new Types.ObjectId().toString()
      const thread = await this.getThreadById(
        threadId,
        !aiGenerationDto.threadId
      )

      const user: User = (
        await this.eventEmitter.emitAsync(EventMap.GetUserDetails, {
          _id: userId,
        })
      ).shift()

      const args: TaxAdvisorStrategyType = {
        temperature: 1.0,
        topP: 1.0,
        thread,
        prompt,
        threadId,
        user,
      }

      const { response } = await this.strategy.taxAdvisorStrategy(args)
      await this.commandBus.execute<CreateThreadCommand, Thread>(
        new CreateThreadCommand(String(user.id), threadId, prompt, response)
      )
      return { response, threadId }
    } catch (error) {
      throw error
    }
  }
}
