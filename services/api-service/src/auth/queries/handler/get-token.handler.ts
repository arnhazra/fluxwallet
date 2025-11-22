import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetTokenQuery } from "../impl/get-token.query"
import { TokenRepository } from "../../repositories/token.repository"
import objectId from "@/shared/utils/convert-objectid"

@QueryHandler(GetTokenQuery)
export class GetTokenQueryHandler implements IQueryHandler<GetTokenQuery> {
  constructor(private readonly repository: TokenRepository) {}

  async execute(query: GetTokenQuery) {
    const { userId } = query
    return await this.repository.findOne({ userId: objectId(userId) })
  }
}
