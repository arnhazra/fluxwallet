import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { GeneralDbConnectionMap } from "@/shared/constants/db-connection.map"
import { Thread } from "./schemas/thread.schema"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class IntelligenceRepository extends EntityRepository<Thread> {
  constructor(
    @InjectModel(Thread.name, GeneralDbConnectionMap.Platform)
    private threadModel: Model<Thread>
  ) {
    super(threadModel)
  }
}
