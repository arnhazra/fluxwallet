import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindAllInstitutionQuery } from "../impl/find-all-institutions.query"
import { InstitutionRepository } from "../../institution.repository"
import objectId from "@/shared/utils/convert-objectid"

@QueryHandler(FindAllInstitutionQuery)
export class FindAllInstitutionQueryHandler
  implements IQueryHandler<FindAllInstitutionQuery>
{
  constructor(private readonly repository: InstitutionRepository) {}

  async execute(query: FindAllInstitutionQuery) {
    const { userId } = query
    return await this.repository.find({
      userId: objectId(userId),
    })
  }
}
