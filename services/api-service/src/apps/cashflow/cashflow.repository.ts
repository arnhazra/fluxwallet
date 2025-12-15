import { Injectable } from "@nestjs/common"
import { Cashflow } from "./schemas/cashflow.schema"
import { AppsDbConnectionMap } from "@/shared/entity/entity-db-connection.map"
import {
  EntityModel,
  EntityRepository,
  InjectEntityModel,
} from "@/shared/entity/entity.repository"

@Injectable()
export class CashFlowRepository extends EntityRepository<Cashflow> {
  constructor(
    @InjectEntityModel(Cashflow.name, AppsDbConnectionMap.CashFlow)
    private cashflowModel: EntityModel<Cashflow>
  ) {
    super(cashflowModel)
  }
}
