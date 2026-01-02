import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindAssetsBySpaceQuery } from "../impl/find-assets-by-space.query"
import { AssetRepository } from "../../asset.repository"
import {
  createOrConvertObjectId,
  QueryFilter,
} from "@/shared/entity/entity.schema"
import { Asset } from "../../schemas/asset.schema"

@QueryHandler(FindAssetsBySpaceQuery)
export class FindAssetsBySpaceQueryHandler implements IQueryHandler<FindAssetsBySpaceQuery> {
  constructor(private readonly repository: AssetRepository) {}

  async execute(query: FindAssetsBySpaceQuery) {
    const { userId, spaceId, searchKeyword } = query

    const filter: QueryFilter<Asset> = {
      userId: createOrConvertObjectId(userId),
      spaceId: createOrConvertObjectId(spaceId),
    }

    if (searchKeyword && searchKeyword.trim().length > 0) {
      filter.assetName = { $regex: new RegExp(searchKeyword, "i") }
    }

    return await this.repository.find(filter).sort({ assetName: 1 })
  }
}
