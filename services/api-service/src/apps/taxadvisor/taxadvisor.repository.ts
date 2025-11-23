import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { AppsDbConnectionMap } from "@/shared/constants/db-connection.map"
import { Thread } from "./schemas/thread.schema"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class TaxAdvisorRepository extends EntityRepository<Thread> {
  constructor(
    @InjectModel(Thread.name, AppsDbConnectionMap.TaxAdvisor)
    private threadModel: Model<Thread>
  ) {
    super(threadModel)
  }
}
