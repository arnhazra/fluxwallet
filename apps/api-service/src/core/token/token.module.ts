import { Module } from "@nestjs/common"
import { TokenService } from "./token.service"
import { TokenController } from "./token.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { EntityModule } from "@/shared/entity/entity.module"
import { Token, TokenSchema } from "./schemas/token.schema"
import { DbConnectionMap } from "@/shared/utils/db-connection.map"
import { SetTokenCommandHandler } from "./commands/handler/set-token.handler"
import { DeleteTokenCommandHandler } from "./commands/handler/delete-token.handler"
import { GetTokenQueryHandler } from "./queries/handler/get-token.handler"
import { TokenRepository } from "./token.repository"

@Module({
  imports: [
    CqrsModule,
    EntityModule.forFeature(
      [{ name: Token.name, schema: TokenSchema }],
      DbConnectionMap.Primary
    ),
  ],
  controllers: [TokenController],
  providers: [
    TokenService,
    TokenRepository,
    SetTokenCommandHandler,
    DeleteTokenCommandHandler,
    GetTokenQueryHandler,
  ],
})
export class TokenModule {}
