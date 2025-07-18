import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindAssetByIdQuery } from "../impl/find-asset-by-id.query"
import { ValuationRepository } from "../../valuation.repository"
import objectId from "src/shared/utils/convert-objectid"

@QueryHandler(FindAssetByIdQuery)
export class FindAssetByIdQueryHandler
  implements IQueryHandler<FindAssetByIdQuery>
{
  constructor(private readonly repository: ValuationRepository) {}

  async execute(query: FindAssetByIdQuery) {
    const { assetId, userId } = query
    return await this.repository.findOne({
      _id: objectId(assetId),
      userId: objectId(userId),
    })
  }
}
