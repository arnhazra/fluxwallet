import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Portfolio } from "./schemas/portfolio.schema"
import { DbConnectionMap } from "src/shared/utils/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class PortfolioRepository extends EntityRepository<Portfolio> {
  constructor(
    @InjectModel(Portfolio.name, DbConnectionMap.Primary)
    private portfolioModel: Model<Portfolio>
  ) {
    super(portfolioModel)
  }
}
