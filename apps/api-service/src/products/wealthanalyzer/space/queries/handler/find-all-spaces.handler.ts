import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindAllSpaceQuery } from "../impl/find-all-spaces.query"
import { SpaceRepository } from "../../space.repository"
import objectId from "@/shared/utils/convert-objectid"
import { FilterQuery } from "mongoose"
import { Space } from "../../schemas/space.schema"

@QueryHandler(FindAllSpaceQuery)
export class FindAllSpaceQueryHandler
  implements IQueryHandler<FindAllSpaceQuery>
{
  constructor(private readonly repository: SpaceRepository) {}

  async execute(query: FindAllSpaceQuery) {
    const { userId, searchKeyword } = query

    const filter: FilterQuery<Space> = {
      userId: objectId(userId),
    }

    if (searchKeyword && searchKeyword.trim().length > 0) {
      filter.spaceName = { $regex: new RegExp(searchKeyword, "i") }
    }

    return await this.repository.find(filter)
  }
}
