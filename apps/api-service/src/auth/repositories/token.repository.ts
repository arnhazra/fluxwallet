import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Token } from "../schemas/token.schema"
import { DbConnectionMap } from "src/shared/utils/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"

@Injectable()
export class TokenRepository extends EntityRepository<Token> {
  constructor(
    @InjectModel(Token.name, DbConnectionMap.Primary)
    private tokenModel: Model<Token>
  ) {
    super(tokenModel)
  }
}
