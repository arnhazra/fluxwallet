import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateThreadCommand } from "./commands/impl/create-thread.command"
import { Thread } from "./schemas/thread.schema"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/constants/event.map"
import { AIChatDto } from "./dto/chat.dto"
import { Types } from "mongoose"
import { FetchThreadByIdQuery } from "./queries/impl/fetch-thread-by-id.query"
import {
  IntelligenceStrategy,
  ChatReqParams,
  SummarizeReqParams,
} from "./intelligence.strategy"
import { User } from "@/auth/schemas/user.schema"
import { AISummarizeDto } from "./dto/summarize.dto"

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
        throw new Error("Thread not found")
      }
    } catch (error) {
      throw error
    }
  }

  async chat(aIChatDto: AIChatDto, userId: string) {
    try {
      const { prompt, model } = aIChatDto
      const threadId = aIChatDto.threadId ?? new Types.ObjectId().toString()
      const thread = await this.getThreadById(threadId, !aIChatDto.threadId)

      const user: User = (
        await this.eventEmitter.emitAsync(EventMap.GetUserDetails, {
          _id: userId,
        })
      ).shift()

      const args: ChatReqParams = {
        genericName: model,
        temperature: 1.0,
        topP: 1.0,
        thread,
        prompt,
        threadId,
        user,
      }

      const { response } = await this.strategy.chatStrategy(args)
      await this.commandBus.execute<CreateThreadCommand, Thread>(
        new CreateThreadCommand(String(user.id), threadId, prompt, response)
      )
      return { response, threadId }
    } catch (error) {
      throw error
    }
  }

  async summarize(aiSummarizeDto: AISummarizeDto, userId: string) {
    try {
      const { entityId, entityType, newsContent, newsDescription, newsTitle } =
        aiSummarizeDto

      const user: User = (
        await this.eventEmitter.emitAsync(EventMap.GetUserDetails, {
          _id: userId,
        })
      ).shift()

      const args: SummarizeReqParams = {
        entityId,
        entityType,
        newsContent,
        newsDescription,
        newsTitle,
        temperature: 1.0,
        topP: 1.0,
        user,
      }

      const { response } = await this.strategy.summarizeStrategy(args)
      return { response }
    } catch (error) {
      throw error
    }
  }
}
