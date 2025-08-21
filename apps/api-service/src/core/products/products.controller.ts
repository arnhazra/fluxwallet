import { Controller, BadRequestException, Get } from "@nestjs/common"
import { ProductsService } from "./products.service"

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts() {
    try {
      return await this.productsService.getProducts()
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
