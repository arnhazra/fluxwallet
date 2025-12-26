import { Injectable } from "@nestjs/common"
import { Space } from "./schemas/space.schema"
import { AppsDbConnectionMap } from "@/shared/entity/entity-db-connection.map"
import {
  EntityModel,
  EntityRepository,
  InjectEntityModel,
} from "@/shared/entity/entity.repository"

@Injectable()
export class SpaceRepository extends EntityRepository<Space> {
  constructor(
    @InjectEntityModel(Space.name, AppsDbConnectionMap.WealthAnalyzer)
    private spaceModel: EntityModel<Space>
  ) {
    super(spaceModel)
  }
}
