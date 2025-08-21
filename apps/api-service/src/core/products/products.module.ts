import { Module } from "@nestjs/common"
import { ProductsService } from "./products.service"
import { ProductsController } from "./products.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { GeneralDbConnectionMap } from "src/shared/utils/db-connection.map"
import { Products, ProductsSchema } from "./schemas/products.schema"
import { ProductsRepository } from "./products.repository"
import { EntityModule } from "@/shared/entity/entity.module"
import { GetProductsQueryHandler } from "./queries/handler/get-products.handler"

@Module({
  imports: [
    CqrsModule,
    EntityModule.forFeature(
      [{ name: Products.name, schema: ProductsSchema }],
      GeneralDbConnectionMap.Core
    ),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, GetProductsQueryHandler],
})
export class ProductsModule {}
