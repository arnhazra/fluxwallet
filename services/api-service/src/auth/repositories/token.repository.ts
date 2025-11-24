import { Injectable } from "@nestjs/common"
import { Token } from "../schemas/token.schema"
import { GeneralDbConnectionMap } from "@/shared/constants/db-connection.map"
import {
  EntityModel,
  EntityRepository,
  InjectEntityModel,
} from "@/shared/entity/entity.repository"

@Injectable()
export class TokenRepository extends EntityRepository<Token> {
  constructor(
    @InjectEntityModel(Token.name, GeneralDbConnectionMap.Auth)
    private tokenModel: EntityModel<Token>
  ) {
    super(tokenModel)
  }
}
