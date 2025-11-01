import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindAssetsByInstitutionQuery } from "../impl/find-assets-by-institution.query"
import { AssetRepository } from "../../asset.repository"
import objectId from "@/shared/utils/convert-objectid"
import { FilterQuery } from "mongoose"
import { Asset } from "../../schemas/asset.schema"

@QueryHandler(FindAssetsByInstitutionQuery)
export class FindAssetsByInstitutionQueryHandler
  implements IQueryHandler<FindAssetsByInstitutionQuery>
{
  constructor(private readonly repository: AssetRepository) {}

  async execute(query: FindAssetsByInstitutionQuery) {
    const { userId, institutionId, searchKeyword } = query

    const filter: FilterQuery<Asset> = {
      userId: objectId(userId),
      institutionId: objectId(institutionId),
    }

    if (searchKeyword && searchKeyword.trim().length > 0) {
      filter.assetName = { $regex: new RegExp(searchKeyword, "i") }
    }

    return await this.repository.find(filter)
  }
}
