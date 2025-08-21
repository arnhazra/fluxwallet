import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Products } from "./schemas/products.schema"
import { GeneralDbConnectionMap } from "src/shared/utils/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class ProductsRepository extends EntityRepository<Products> {
  constructor(
    @InjectModel(Products.name, GeneralDbConnectionMap.Core)
    private productsModel: Model<Products>
  ) {
    super(productsModel)
  }
}
