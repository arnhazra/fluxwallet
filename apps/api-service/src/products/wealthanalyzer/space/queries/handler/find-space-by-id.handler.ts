import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindSpaceByIdQuery } from "../impl/find-space-by-id.query"
import { SpaceRepository } from "../../space.repository"
import objectId from "@/shared/utils/convert-objectid"

@QueryHandler(FindSpaceByIdQuery)
export class FindSpaceByIdQueryHandler
  implements IQueryHandler<FindSpaceByIdQuery>
{
  constructor(private readonly repository: SpaceRepository) {}

  async execute(query: FindSpaceByIdQuery) {
    const { spaceId, userId } = query
    return await this.repository.findOne({
      _id: objectId(spaceId),
      userId: objectId(userId),
    })
  }
}
