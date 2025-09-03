import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Debt } from "./schemas/debt.schema"
import { ProductsDbConnectionMap } from "@/shared/constants/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class DebtRepository extends EntityRepository<Debt> {
  constructor(
    @InjectModel(Debt.name, ProductsDbConnectionMap.DebtTrack)
    private debtModel: Model<Debt>
  ) {
    super(debtModel)
  }
}
