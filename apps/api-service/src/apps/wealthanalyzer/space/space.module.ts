import { Module } from "@nestjs/common"
import { SpaceService } from "./space.service"
import { SpaceController } from "./space.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { Space, SpaceSchema } from "./schemas/space.schema"
import { AppsDbConnectionMap } from "@/shared/constants/db-connection.map"
import { SpaceRepository } from "./space.repository"
import { CreateSpaceCommandHandler } from "./commands/handler/create-space.handler"
import { DeleteSpaceCommandHandler } from "./commands/handler/delete-space.handler"
import { FindAllSpaceQueryHandler } from "./queries/handler/find-all-spaces.handler"
import { FindSpaceByIdQueryHandler } from "./queries/handler/find-space-by-id.handler"
import { EntityModule } from "@/shared/entity/entity.module"
import { UpdateSpaceCommandHandler } from "./commands/handler/update-space.handler"
import { AssetModule } from "../asset/asset.module"

@Module({
  imports: [
    CqrsModule,
    AssetModule,
    EntityModule.forFeature(
      [{ name: Space.name, schema: SpaceSchema }],
      AppsDbConnectionMap.WealthAnalyzer
    ),
  ],
  controllers: [SpaceController],
  providers: [
    SpaceService,
    SpaceRepository,
    CreateSpaceCommandHandler,
    UpdateSpaceCommandHandler,
    DeleteSpaceCommandHandler,
    FindAllSpaceQueryHandler,
    FindSpaceByIdQueryHandler,
  ],
})
export class SpaceModule {}
