import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Institution } from "./schemas/institution.schema"
import { ProductsDbConnectionMap } from "src/shared/utils/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class InstitutionRepository extends EntityRepository<Institution> {
  constructor(
    @InjectModel(Institution.name, ProductsDbConnectionMap.AssetManager)
    private institutionModel: Model<Institution>
  ) {
    super(institutionModel)
  }
}
