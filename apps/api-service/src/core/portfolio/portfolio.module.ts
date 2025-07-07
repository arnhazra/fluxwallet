import { Module } from "@nestjs/common"
import { PortfolioService } from "./portfolio.service"
import { PortfolioController } from "./portfolio.controller"
import { CqrsModule } from "@nestjs/cqrs"
import { Portfolio, PortfolioSchema } from "./schemas/portfolio.schema"
import { DbConnectionMap } from "src/shared/utils/db-connection.map"
import { PortfolioRepository } from "./portfolio.repository"
import { CreatePortfolioCommandHandler } from "./commands/handler/create-portfolio.handler"
import { DeletePortfolioCommandHandler } from "./commands/handler/delete-portfolio.handler"
import { FindAllPortfolioQueryHandler } from "./queries/handler/find-all-portfolios.handler"
import { FindPortfolioByIdQueryHandler } from "./queries/handler/find-portfolio-by-id.handler"
import { EntityModule } from "@/shared/entity/entity.module"

@Module({
  imports: [
    CqrsModule,
    EntityModule.forFeature(
      [{ name: Portfolio.name, schema: PortfolioSchema }],
      DbConnectionMap.Primary
    ),
  ],
  controllers: [PortfolioController],
  providers: [
    PortfolioService,
    PortfolioRepository,
    CreatePortfolioCommandHandler,
    DeletePortfolioCommandHandler,
    FindAllPortfolioQueryHandler,
    FindPortfolioByIdQueryHandler,
  ],
})
export class PortfolioModule {}
