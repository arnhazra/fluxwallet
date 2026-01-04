import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { EventRepository } from "../../event.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"
import { UpdateEventCommand } from "../impl/update-event.command"
import { toDateOnlyUTC } from "@/apps/cashflow/helpers/to-date"

@CommandHandler(UpdateEventCommand)
export class UpdateEventCommandHandler implements ICommandHandler<UpdateEventCommand> {
  constructor(private readonly repository: EventRepository) {}

  async execute(command: UpdateEventCommand) {
    const {
      eventId,
      dto: { eventDate, eventName },
    } = command
    return await this.repository.update(
      { _id: createOrConvertObjectId(eventId) },
      {
        eventName,
        eventDate: toDateOnlyUTC(eventDate),
      }
    )
  }
}
