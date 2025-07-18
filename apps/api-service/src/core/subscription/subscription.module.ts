import { Module } from "@nestjs/common"
import { SubscriptionService } from "./subscription.service"
import { SubscriptionController } from "./subscription.controller"
import { CreateSubscriptionCommandHandler } from "./commands/handler/create-subscription.handler"
import { SubscriptionRepository } from "./subscription.repository"
import { FindSubscriptionByUserIdQueryHandler } from "./queries/handler/find-subscription-by-user-id.handler"
import { CqrsModule } from "@nestjs/cqrs"
import { EntityModule } from "@/shared/entity/entity.module"
import { Subscription, SubscriptionSchema } from "./schemas/subscription.schema"
import { DbConnectionMap } from "src/shared/utils/db-connection.map"

@Module({
  imports: [
    CqrsModule,
    EntityModule.forFeature(
      [{ name: Subscription.name, schema: SubscriptionSchema }],
      DbConnectionMap.Primary
    ),
  ],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    FindSubscriptionByUserIdQueryHandler,
    SubscriptionRepository,
    CreateSubscriptionCommandHandler,
  ],
})
export class SubscriptionModule {}
