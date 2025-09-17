import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { BlockListedSession } from "../schemas/blocklisted-session.schema"
import { GeneralDbConnectionMap } from "@/shared/constants/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class BlockListedSessionRepository extends EntityRepository<BlockListedSession> {
  constructor(
    @InjectModel(BlockListedSession.name, GeneralDbConnectionMap.Platform)
    private blockListedSessionModel: Model<BlockListedSession>
  ) {
    super(blockListedSessionModel)
  }
}
