import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { SpaceRepository } from "../../space.repository"
import objectId from "@/shared/utils/convert-objectid"
import { FindSpaceByNameQuery } from "../impl/find-space-by-name.query"

@QueryHandler(FindSpaceByNameQuery)
export class FindSpaceByNameQueryHandler
  implements IQueryHandler<FindSpaceByNameQuery>
{
  constructor(private readonly repository: SpaceRepository) {}

  async execute(query: FindSpaceByNameQuery) {
    const { spaceName, userId } = query
    return await this.repository.findOne({
      spaceName: { $regex: new RegExp(spaceName, "i") },
      userId: objectId(userId),
    })
  }
}
