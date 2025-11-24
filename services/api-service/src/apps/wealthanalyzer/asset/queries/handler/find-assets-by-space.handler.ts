import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindAssetsBySpaceQuery } from "../impl/find-assets-by-space.query"
import { AssetRepository } from "../../asset.repository"
import objectId from "@/shared/utils/convert-objectid"
import { Asset } from "../../schemas/asset.schema"
import { QueryFilter } from "@/shared/entity/entity.schema"

@QueryHandler(FindAssetsBySpaceQuery)
export class FindAssetsBySpaceQueryHandler
  implements IQueryHandler<FindAssetsBySpaceQuery>
{
  constructor(private readonly repository: AssetRepository) {}

  async execute(query: FindAssetsBySpaceQuery) {
    const { userId, spaceId, searchKeyword } = query

    const filter: QueryFilter<Asset> = {
      userId: objectId(userId),
      spaceId: objectId(spaceId),
    }

    if (searchKeyword && searchKeyword.trim().length > 0) {
      filter.assetName = { $regex: new RegExp(searchKeyword, "i") }
    }

    return await this.repository.find(filter)
  }
}
