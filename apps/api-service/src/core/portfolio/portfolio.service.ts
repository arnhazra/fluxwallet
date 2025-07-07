import { BadRequestException, Injectable } from "@nestjs/common"
import { statusMessages } from "@/shared/constants/status-messages"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { FindAllPortfolioQuery } from "./queries/impl/find-all-portfolios.query"
import { FindPortfolioByIdQuery } from "./queries/impl/find-portfolio-by-id.query"
import { Portfolio } from "./schemas/portfolio.schema"
import { DeletePortfolioCommand } from "./commands/impl/delete-portfolio.command"
import { CreatePortfolioCommand } from "./commands/impl/create-portfolio.command"
import { CreatePortfolioRequestDto } from "./dto/request/create-portfolio.request.dto"

@Injectable()
export class PortfolioService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  async createPortfolio(
    userId: string,
    requestBody: CreatePortfolioRequestDto
  ) {
    try {
      return await this.commandBus.execute<CreatePortfolioCommand, Portfolio>(
        new CreatePortfolioCommand(userId, requestBody)
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async findMyPortfolios(userId: string) {
    try {
      return await this.queryBus.execute<FindAllPortfolioQuery, Portfolio[]>(
        new FindAllPortfolioQuery(userId)
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async findPortfolioById(reqUserId: string, portfolioId: string) {
    try {
      const portfolio = await this.queryBus.execute<
        FindPortfolioByIdQuery,
        Portfolio
      >(new FindPortfolioByIdQuery(portfolioId))
      if (portfolio.userId.toString() !== reqUserId) {
        throw new BadRequestException(statusMessages.connectionError)
      }
      return portfolio
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async deletePortfolio(reqUserId: string, portfolioId: string) {
    try {
      const { userId } = await this.queryBus.execute<
        FindPortfolioByIdQuery,
        Portfolio
      >(new FindPortfolioByIdQuery(portfolioId))
      if (userId.toString() === reqUserId) {
        await this.commandBus.execute(new DeletePortfolioCommand(portfolioId))
        return { success: true }
      } else {
        throw new BadRequestException(statusMessages.connectionError)
      }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }
}
