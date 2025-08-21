import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { SolutionRepository } from "../../solution.repository"
import { GetSolutionQuery } from "../impl/get-solutions.query"

@QueryHandler(GetSolutionQuery)
export class GetSolutionQueryHandler
  implements IQueryHandler<GetSolutionQuery>
{
  constructor(private readonly repository: SolutionRepository) {}

  async execute(query: GetSolutionQuery) {
    return await this.repository.find()
  }
}
