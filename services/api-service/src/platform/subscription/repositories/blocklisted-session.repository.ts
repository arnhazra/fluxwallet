import { Injectable } from "@nestjs/common"
import { BlockListedSession } from "../schemas/blocklisted-session.schema"
import { GeneralDbConnectionMap } from "@/shared/entity/entity-db-connection.map"
import {
  EntityModel,
  EntityRepository,
  InjectEntityModel,
} from "@/shared/entity/entity.repository"

@Injectable()
export class BlockListedSessionRepository extends EntityRepository<BlockListedSession> {
  constructor(
    @InjectEntityModel(BlockListedSession.name, GeneralDbConnectionMap.Platform)
    private blockListedSessionModel: EntityModel<BlockListedSession>
  ) {
    super(blockListedSessionModel)
  }
}
