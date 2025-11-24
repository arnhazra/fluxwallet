import { Injectable } from "@nestjs/common"
import { Subscription } from "../schemas/subscription.schema"
import { GeneralDbConnectionMap } from "@/shared/constants/db-connection.map"
import {
  EntityModel,
  EntityRepository,
  InjectEntityModel,
} from "@/shared/entity/entity.repository"

@Injectable()
export class SubscriptionRepository extends EntityRepository<Subscription> {
  constructor(
    @InjectEntityModel(Subscription.name, GeneralDbConnectionMap.Platform)
    private subscriptionModel: EntityModel<Subscription>
  ) {
    super(subscriptionModel)
  }
}
