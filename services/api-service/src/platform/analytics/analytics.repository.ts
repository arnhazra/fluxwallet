import { Injectable } from "@nestjs/common"
import { Analytics } from "./schemas/analytics.schema"
import { GeneralDbConnectionMap } from "@/shared/constants/db-connection.map"
import {
  EntityModel,
  EntityRepository,
  InjectEntityModel,
} from "@/shared/entity/entity.repository"

@Injectable()
export class AnalyticsRepository extends EntityRepository<Analytics> {
  constructor(
    @InjectEntityModel(Analytics.name, GeneralDbConnectionMap.Platform)
    private analyticsModel: EntityModel<Analytics>
  ) {
    super(analyticsModel)
  }
}
