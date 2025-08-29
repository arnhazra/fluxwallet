import { Module } from "@nestjs/common"
import { InstitutionService } from "./institution.service"
import { InstitutionController } from "./institution.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { Institution, InstitutionSchema } from "./schemas/institution.schema"
import { ProductsDbConnectionMap } from "src/shared/utils/db-connection.map"
import { InstitutionRepository } from "./institution.repository"
import { CreateInstitutionCommandHandler } from "./commands/handler/create-institution.handler"
import { DeleteInstitutionCommandHandler } from "./commands/handler/delete-institution.handler"
import { FindAllInstitutionQueryHandler } from "./queries/handler/find-all-institutions.handler"
import { FindInstitutionByIdQueryHandler } from "./queries/handler/find-institution-by-id.handler"
import { EntityModule } from "@/shared/entity/entity.module"
import { UpdateInstitutionCommandHandler } from "./commands/handler/update-institution.handler"
import { FindInstitutionByNameQueryHandler } from "./queries/handler/find-institution-by-name.handler"
import { ValuationModule } from "../valuation/valuation.module"

@Module({
  imports: [
    CqrsModule,
    ValuationModule,
    EntityModule.forFeatureAsync(
      [{ name: Institution.name, schema: InstitutionSchema }],
      ProductsDbConnectionMap.WealthAnalyzer
    ),
  ],
  controllers: [InstitutionController],
  providers: [
    InstitutionService,
    InstitutionRepository,
    CreateInstitutionCommandHandler,
    UpdateInstitutionCommandHandler,
    DeleteInstitutionCommandHandler,
    FindAllInstitutionQueryHandler,
    FindInstitutionByIdQueryHandler,
    FindInstitutionByNameQueryHandler,
  ],
})
export class InstitutionModule {}
