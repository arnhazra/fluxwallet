import { Injectable } from "@nestjs/common"
import { statusMessages } from "@/shared/constants/status-messages"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Event } from "./schemas/event.schema"
import { DeleteEventCommand } from "./commands/impl/delete-event.command"
import { CreateEventCommand } from "./commands/impl/create-event.command"
import { CreateEventRequestDto } from "./dto/request/create-event.request.dto"
import { UpdateEventCommand } from "./commands/impl/update-event.command"
import { FindEventsByUserQuery } from "./queries/impl/find-event-by-user.query"

@Injectable()
export class EventService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  async createEvent(userId: string, requestBody: CreateEventRequestDto) {
    try {
      return await this.commandBus.execute<CreateEventCommand, Event>(
        new CreateEventCommand(userId, requestBody)
      )
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async findMyEvents(userId: string) {
    try {
      return await this.queryBus.execute<FindEventsByUserQuery, Event[]>(
        new FindEventsByUserQuery(userId)
      )
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async updateEventById(
    userId: string,
    eventId: string,
    requestBody: CreateEventRequestDto
  ) {
    try {
      return await this.commandBus.execute<UpdateEventCommand, Event>(
        new UpdateEventCommand(userId, eventId, requestBody)
      )
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async deleteEvent(reqUserId: string, eventId: string) {
    try {
      await this.commandBus.execute(new DeleteEventCommand(eventId))
      return { success: true }
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }
}
