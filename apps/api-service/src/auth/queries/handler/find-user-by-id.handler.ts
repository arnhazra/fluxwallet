import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { AuthRepository } from "../../auth.repository"
import { FindUserByIdQuery } from "../impl/find-user-by-id.query"
import objectId from "@/shared/utils/convert-objectid"

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler
  implements IQueryHandler<FindUserByIdQuery>
{
  constructor(private readonly repository: AuthRepository) {}

  async execute(query: FindUserByIdQuery) {
    const { userId } = query
    return await this.repository.findOne({ _id: objectId(userId) })
  }
}
