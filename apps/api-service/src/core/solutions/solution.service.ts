import { BadRequestException, Injectable } from "@nestjs/common"
import { QueryBus } from "@nestjs/cqrs"
import { Solution } from "./schemas/solution.schema"
import { GetSolutionQuery } from "./queries/impl/get-solutions.query"

@Injectable()
export class SolutionService {
  constructor(private readonly queryBus: QueryBus) {}

  async getSolution() {
    try {
      return this.queryBus.execute<GetSolutionQuery, Solution[]>(
        new GetSolutionQuery()
      )
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
