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
import { GetOTPQueryHandler } from "./queries/handler/get-otp.handler"
import { GetTokenQueryHandler } from "./queries/handler/get-token.handler"
import { DeleteTokenCommandHandler } from "./commands/handler/delete-token.handler"
import { Token, TokenSchema } from "./schemas/token.schema"
import { TokenRepository } from "./repositories/token.repository"
import { OTPRepository } from "./repositories/otp.repository"
import { SetOTPCommandHandler } from "./commands/handler/set-otp.handler"
import { OneTimePassword, OTPSchema } from "./schemas/otp.schema"
import { DeleteOTPCommandHandler } from "./commands/handler/delete-otp.handler"

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
    EntityModule.forFeature(
      [{ name: OneTimePassword.name, schema: OTPSchema }],
      DbConnectionMap.Primary
    ),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    TokenRepository,
    OTPRepository,
    CreateUserCommandHandler,
    UpdateAttributeCommandHandler,
    FindUserByEmailQueryHandler,
    FindUserByIdQueryHandler,
    SetTokenCommandHandler,
    GetTokenQueryHandler,
    DeleteTokenCommandHandler,
    SetOTPCommandHandler,
    GetOTPQueryHandler,
    DeleteOTPCommandHandler,
  ],
})
export class AuthModule {}
