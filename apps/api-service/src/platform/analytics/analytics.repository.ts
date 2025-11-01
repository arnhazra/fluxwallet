import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Analytics } from "./schemas/analytics.schema"
import { GeneralDbConnectionMap } from "@/shared/constants/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class AnalyticsRepository extends EntityRepository<Analytics> {
  constructor(
    @InjectModel(Analytics.name, GeneralDbConnectionMap.Platform)
    private analyticsModel: Model<Analytics>
  ) {
    super(analyticsModel)
  }
}
