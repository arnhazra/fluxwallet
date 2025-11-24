import { Injectable } from "@nestjs/common"
import { GeneralDbConnectionMap } from "@/shared/entity/entity-db-connection.map"
import { Thread } from "./schemas/thread.schema"
import {
  EntityModel,
  EntityRepository,
  InjectEntityModel,
} from "@/shared/entity/entity.repository"

@Injectable()
export class IntelligenceRepository extends EntityRepository<Thread> {
  constructor(
    @InjectEntityModel(Thread.name, GeneralDbConnectionMap.Platform)
    private threadModel: EntityModel<Thread>
  ) {
    super(threadModel)
  }
}
