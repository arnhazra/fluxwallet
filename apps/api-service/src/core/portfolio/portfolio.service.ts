import { BadRequestException, Injectable } from "@nestjs/common"
import { statusMessages } from "@/shared/constants/status-messages"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { FindAllPortfolioQuery } from "./queries/impl/find-all-portfolios.query"
import { FindPortfolioByIdQuery } from "./queries/impl/find-portfolio-by-id.query"
import { Portfolio } from "./schemas/portfolio.schema"
import { DeletePortfolioCommand } from "./commands/impl/delete-portfolio.command"
import { CreatePortfolioCommand } from "./commands/impl/create-portfolio.command"
import { CreatePortfolioRequestDto } from "./dto/request/create-portfolio.request.dto"
import { UpdatePortfolioCommand } from "./commands/impl/update-portfolio.command"
import { OnEvent } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/utils/event.map"
import { FindPortfolioByNameQuery } from "./queries/impl/find-portfolio-by-name.query"

@Injectable()
export class PortfolioService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @OnEvent(EventMap.CreatePortfolio)
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

  @OnEvent(EventMap.GetPortfolioList)
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
      return await this.queryBus.execute<FindPortfolioByIdQuery, Portfolio>(
        new FindPortfolioByIdQuery(reqUserId, portfolioId)
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @OnEvent(EventMap.FindPortfolioByName)
  async findPortfolioByName(reqUserId: string, portfolioName: string) {
    try {
      return await this.queryBus.execute<FindPortfolioByNameQuery, Portfolio>(
        new FindPortfolioByNameQuery(reqUserId, portfolioName)
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async updatePortfolioById(
    userId: string,
    portfolioId: string,
    requestBody: CreatePortfolioRequestDto
  ) {
    try {
      return await this.commandBus.execute<UpdatePortfolioCommand, Portfolio>(
        new UpdatePortfolioCommand(userId, portfolioId, requestBody)
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async deletePortfolio(reqUserId: string, portfolioId: string) {
    try {
      const { userId } = await this.queryBus.execute<
        FindPortfolioByIdQuery,
        Portfolio
      >(new FindPortfolioByIdQuery(reqUserId, portfolioId))
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
