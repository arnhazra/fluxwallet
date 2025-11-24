import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindSpaceByIdQuery } from "../impl/find-space-by-id.query"
import { SpaceRepository } from "../../space.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@QueryHandler(FindSpaceByIdQuery)
export class FindSpaceByIdQueryHandler
  implements IQueryHandler<FindSpaceByIdQuery>
{
  constructor(private readonly repository: SpaceRepository) {}

  async execute(query: FindSpaceByIdQuery) {
    const { spaceId, userId } = query
    return await this.repository.findOne({
      _id: createOrConvertObjectId(spaceId),
      userId: createOrConvertObjectId(userId),
    })
  }
}
