import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetTokensQuery } from "../impl/get-tokens.query"
import { TokenRepository } from "../../repositories/token.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@QueryHandler(GetTokensQuery)
export class GetTokensQueryHandler implements IQueryHandler<GetTokensQuery> {
  constructor(private readonly repository: TokenRepository) {}

  async execute(query: GetTokensQuery) {
    const { userId } = query
    return await this.repository.find({
      userId: createOrConvertObjectId(userId),
    })
  }
}
