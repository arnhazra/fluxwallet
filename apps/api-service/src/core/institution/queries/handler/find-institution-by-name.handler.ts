import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { InstitutionRepository } from "../../institution.repository"
import objectId from "@/shared/utils/convert-objectid"
import { FindInstitutionByNameQuery } from "../impl/find-institution-by-name.query"

@QueryHandler(FindInstitutionByNameQuery)
export class FindInstitutionByNameQueryHandler
  implements IQueryHandler<FindInstitutionByNameQuery>
{
  constructor(private readonly repository: InstitutionRepository) {}

  async execute(query: FindInstitutionByNameQuery) {
    const { institutionName, userId } = query
    return await this.repository.findOne({
      institutionName: { $regex: new RegExp(institutionName, "i") },
      userId: objectId(userId),
    })
  }
}
