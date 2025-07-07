import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindAllAssetQuery } from "../impl/find-all-assets.query"
import { AssetRepository } from "../../asset.repository"
import objectId from "src/shared/utils/convert-objectid"

@QueryHandler(FindAllAssetQuery)
export class FindAllAssetQueryHandler
  implements IQueryHandler<FindAllAssetQuery>
{
  constructor(private readonly repository: AssetRepository) {}

  async execute(query: FindAllAssetQuery) {
    const { userId } = query
    return await this.repository.find({
      userId: objectId(userId),
    })
  }
}
