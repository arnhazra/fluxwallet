import { Injectable } from "@nestjs/common"
import { AppsDbConnectionMap } from "@/shared/entity/entity-db-connection.map"
import { Thread } from "./schemas/thread.schema"
import {
  EntityModel,
  EntityRepository,
  InjectEntityModel,
} from "@/shared/entity/entity.repository"

@Injectable()
export class TaxAdvisorRepository extends EntityRepository<Thread> {
  constructor(
    @InjectEntityModel(Thread.name, AppsDbConnectionMap.TaxAdvisor)
    private threadModel: EntityModel<Thread>
  ) {
    super(threadModel)
  }
}
