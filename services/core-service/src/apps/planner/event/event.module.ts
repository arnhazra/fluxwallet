import { Module } from "@nestjs/common"
import { EventService } from "./event.service"
import { EventController } from "./event.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { Event, EventSchema } from "./schemas/event.schema"
import { AppsDbConnectionMap } from "@/shared/entity/entity-db-connection.map"
import { EventRepository } from "./event.repository"
import { CreateEventCommandHandler } from "./commands/handler/create-event.handler"
import { DeleteEventCommandHandler } from "./commands/handler/delete-event.handler"
import { EntityModule } from "@/shared/entity/entity.module"
import { UpdateEventCommandHandler } from "./commands/handler/update-event.handler"
import { FindEventsByUserQueryHandler } from "./queries/handler/find-event-by-user.handler"

@Module({
  imports: [
    CqrsModule,
    EntityModule.forFeature(
      [{ name: Event.name, schema: EventSchema }],
      AppsDbConnectionMap.Planner
    ),
  ],
  controllers: [EventController],
  providers: [
    EventService,
    EventRepository,
    CreateEventCommandHandler,
    UpdateEventCommandHandler,
    DeleteEventCommandHandler,
    FindEventsByUserQueryHandler,
  ],
})
export class EventModule {}
