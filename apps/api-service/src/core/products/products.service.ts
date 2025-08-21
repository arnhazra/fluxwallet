import { BadRequestException, Injectable } from "@nestjs/common"
import { QueryBus } from "@nestjs/cqrs"
import { Products } from "./schemas/products.schema"
import { GetProductsQuery } from "./queries/impl/get-products.query"

@Injectable()
export class ProductsService {
  constructor(private readonly queryBus: QueryBus) {}

  async getProducts() {
    try {
      return this.queryBus.execute<GetProductsQuery, Products[]>(
        new GetProductsQuery()
      )
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
