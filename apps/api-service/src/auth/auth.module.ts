import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { UserRepository } from "./repositories/user.repository"
import { User, UserSchema } from "./schemas/user.schema"
import { DbConnectionMap } from "src/shared/utils/db-connection.map"
import { CqrsModule } from "@nestjs/cqrs"
import { CreateUserCommandHandler } from "./commands/handler/create-user.handler"
import { FindUserByEmailQueryHandler } from "./queries/handler/find-user-by-email.handler"
import { FindUserByIdQueryHandler } from "./queries/handler/find-user-by-id.handler"
import { UpdateAttributeCommandHandler } from "./commands/handler/update-attribute.handler"
import { EntityModule } from "@/shared/entity/entity.module"
import { HttpModule } from "@nestjs/axios"
import { SetTokenCommandHandler } from "./commands/handler/set-token.handler"
import { GetTokenQueryHandler } from "./queries/handler/get-token.handler"
import { DeleteTokenCommandHandler } from "./commands/handler/delete-token.handler"
import { Token, TokenSchema } from "./schemas/token.schema"
import { TokenRepository } from "./repositories/token.repository"

@Module({
  imports: [
    CqrsModule,
    HttpModule,
    EntityModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      DbConnectionMap.Primary
    ),
    EntityModule.forFeature(
      [{ name: Token.name, schema: TokenSchema }],
      DbConnectionMap.Primary
    ),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    TokenRepository,
    CreateUserCommandHandler,
    UpdateAttributeCommandHandler,
    FindUserByEmailQueryHandler,
    FindUserByIdQueryHandler,
    SetTokenCommandHandler,
    GetTokenQueryHandler,
    DeleteTokenCommandHandler,
  ],
})
export class AuthModule {}
