import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindInstitutionByIdQuery } from "../impl/find-institution-by-id.query"
import { InstitutionRepository } from "../../institution.repository"
import objectId from "@/shared/utils/convert-objectid"

@QueryHandler(FindInstitutionByIdQuery)
export class FindInstitutionByIdQueryHandler
  implements IQueryHandler<FindInstitutionByIdQuery>
{
  constructor(private readonly repository: InstitutionRepository) {}

  async execute(query: FindInstitutionByIdQuery) {
    const { institutionId, userId } = query
    return await this.repository.findOne({
      _id: objectId(institutionId),
      userId: objectId(userId),
    })
  }
}
