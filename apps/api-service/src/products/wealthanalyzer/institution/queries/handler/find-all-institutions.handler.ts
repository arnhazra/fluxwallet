import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { FindAllInstitutionQuery } from "../impl/find-all-institutions.query"
import { InstitutionRepository } from "../../institution.repository"
import objectId from "@/shared/utils/convert-objectid"
import { FilterQuery } from "mongoose"
import { Institution } from "../../schemas/institution.schema"

@QueryHandler(FindAllInstitutionQuery)
export class FindAllInstitutionQueryHandler
  implements IQueryHandler<FindAllInstitutionQuery>
{
  constructor(private readonly repository: InstitutionRepository) {}

  async execute(query: FindAllInstitutionQuery) {
    const { userId, searchKeyword } = query

    const filter: FilterQuery<Institution> = {
      userId: objectId(userId),
    }

    if (searchKeyword && searchKeyword.trim().length > 0) {
      filter.institutionName = { $regex: new RegExp(searchKeyword, "i") }
    }

    return await this.repository.find(filter)
  }
}
