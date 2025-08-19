import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { ProductsDbConnectionMap } from "src/shared/utils/db-connection.map"
import { Thread } from "./schemas/thread.schema"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class AdvisorXRepository extends EntityRepository<Thread> {
  constructor(
    @InjectModel(Thread.name, ProductsDbConnectionMap.AdvisorX)
    private threadModel: Model<Thread>
  ) {
    super(threadModel)
  }
}
