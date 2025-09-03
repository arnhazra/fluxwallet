import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Token } from "../schemas/token.schema"
import { GeneralDbConnectionMap } from "@/shared/constants/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class TokenRepository extends EntityRepository<Token> {
  constructor(
    @InjectModel(Token.name, GeneralDbConnectionMap.Auth)
    private tokenModel: Model<Token>
  ) {
    super(tokenModel)
  }
}
