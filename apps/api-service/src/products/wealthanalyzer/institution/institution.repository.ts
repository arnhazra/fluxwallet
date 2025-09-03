import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Institution } from "./schemas/institution.schema"
import { ProductsDbConnectionMap } from "@/shared/constants/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class InstitutionRepository extends EntityRepository<Institution> {
  constructor(
    @InjectModel(Institution.name, ProductsDbConnectionMap.WealthAnalyzer)
    private institutionModel: Model<Institution>
  ) {
    super(institutionModel)
  }
}
