import { Module } from "@nestjs/common"
import { SubscriptionService } from "./subscription.service"
import { SubscriptionController } from "./subscription.controller"
import { CreateSubscriptionCommandHandler } from "./commands/handler/create-subscription.handler"
import { SubscriptionRepository } from "./repositories/subscription.repository"
import { FindSubscriptionByUserIdQueryHandler } from "./queries/handler/find-subscription-by-user-id.handler"
import { CqrsModule } from "@nestjs/cqrs"
import { EntityModule } from "@/shared/entity/entity.module"
import { Subscription, SubscriptionSchema } from "./schemas/subscription.schema"
import { GeneralDbConnectionMap } from "@/shared/constants/db-connection.map"
import { FindBlockListedSessionByIdQueryHandler } from "./queries/handler/find-blocklisted-session.handler"
import { CreateBlockListedSessionCommandHandler } from "./commands/handler/create-blocklisted-session.handler"
import { BlockListedSessionRepository } from "./repositories/blocklisted-session.repository"
import {
  BlockListedSession,
  BlockListedSessionSchema,
} from "./schemas/blocklisted-session.schema"

@Module({
  imports: [
    CqrsModule,
    EntityModule.forFeature(
      [
        { name: Subscription.name, schema: SubscriptionSchema },
        { name: BlockListedSession.name, schema: BlockListedSessionSchema },
      ],
      GeneralDbConnectionMap.Platform
    ),
  ],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    SubscriptionRepository,
    FindSubscriptionByUserIdQueryHandler,
    CreateSubscriptionCommandHandler,
    BlockListedSessionRepository,
    FindBlockListedSessionByIdQueryHandler,
    CreateBlockListedSessionCommandHandler,
  ],
})
export class SubscriptionModule {}
