import { Module } from "@nestjs/common"
import { ApiReferenceService } from "./apireference.service"
import { ApiReferenceController } from "./apireference.controller"
import { ApiReferenceRepository } from "./apireference.repository"
import { CqrsModule } from "@nestjs/cqrs"
import { ApiReference, ApiReferenceSchema } from "./schemas/apireference.schema"
import { DbConnectionMap } from "src/shared/utils/db-connection.map"
import { FindAPIReferencesQueryHandler } from "./queries/handler/find-apireferences.handler"
import { EntityModule } from "@/shared/entity/entity.module"

@Module({
  imports: [
    CqrsModule,
    EntityModule.forFeature(
      [{ name: ApiReference.name, schema: ApiReferenceSchema }],
      DbConnectionMap.Primary
    ),
  ],
  controllers: [ApiReferenceController],
  providers: [
    ApiReferenceService,
    ApiReferenceRepository,
    FindAPIReferencesQueryHandler,
  ],
})
export class ApiReferenceModule {}
