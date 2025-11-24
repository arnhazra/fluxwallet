import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindAllSpaceQuery } from "../impl/find-all-spaces.query"
import { SpaceRepository } from "../../space.repository"
import {
  createOrConvertObjectId,
  QueryFilter,
} from "@/shared/entity/entity.schema"
import { Space } from "../../schemas/space.schema"

@QueryHandler(FindAllSpaceQuery)
export class FindAllSpaceQueryHandler
  implements IQueryHandler<FindAllSpaceQuery>
{
  constructor(private readonly repository: SpaceRepository) {}

  async execute(query: FindAllSpaceQuery) {
    const { userId, searchKeyword } = query

    const filter: QueryFilter<Space> = {
      userId: createOrConvertObjectId(userId),
    }

    if (searchKeyword && searchKeyword.trim().length > 0) {
      filter.spaceName = { $regex: new RegExp(searchKeyword, "i") }
    }

    return await this.repository.find(filter)
  }
}
