import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { AuthRepository } from "./auth.repository"
import { User, UserSchema } from "./schemas/user.schema"
import { DbConnectionMap } from "src/shared/utils/db-connection.map"
import { CqrsModule } from "@nestjs/cqrs"
import { CreateUserCommandHandler } from "./commands/handler/create-user.handler"
import { FindUserByEmailQueryHandler } from "./queries/handler/find-user-by-email.handler"
import { FindUserByIdQueryHandler } from "./queries/handler/find-user-by-id.handler"
import { UpdateAttributeCommandHandler } from "./commands/handler/update-attribute.handler"
import { EntityModule } from "@/shared/entity/entity.module"
import { HttpModule } from "@nestjs/axios"

@Module({
  imports: [
    CqrsModule,
    HttpModule,
    EntityModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      DbConnectionMap.Primary
    ),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    CreateUserCommandHandler,
    UpdateAttributeCommandHandler,
    FindUserByEmailQueryHandler,
    FindUserByIdQueryHandler,
  ],
})
export class AuthModule {}
