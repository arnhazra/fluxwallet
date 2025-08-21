import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { ProductsRepository } from "../../products.repository"
import { GetProductsQuery } from "../impl/get-products.query"

@QueryHandler(GetProductsQuery)
export class GetProductsQueryHandler
  implements IQueryHandler<GetProductsQuery>
{
  constructor(private readonly repository: ProductsRepository) {}

  async execute(query: GetProductsQuery) {
    return await this.repository.find()
  }
}
