import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindAssetsByInstitutionQuery } from "../impl/find-assets-by-institution.query"
import { AssetRepository } from "../../asset.repository"
import objectId from "@/shared/utils/convert-objectid"

@QueryHandler(FindAssetsByInstitutionQuery)
export class FindAssetsByInstitutionQueryHandler
  implements IQueryHandler<FindAssetsByInstitutionQuery>
{
  constructor(private readonly repository: AssetRepository) {}

  async execute(query: FindAssetsByInstitutionQuery) {
    const { userId, institutionId } = query
    return await this.repository.find({
      userId: objectId(userId),
      institutionId: objectId(institutionId),
    })
  }
}
