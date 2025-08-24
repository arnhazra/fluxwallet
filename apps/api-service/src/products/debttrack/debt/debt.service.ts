import { BadRequestException, Injectable } from "@nestjs/common"
import { statusMessages } from "@/shared/constants/status-messages"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Debt } from "./schemas/debt.schema"
import { DeleteDebtCommand } from "./commands/impl/delete-debt.command"
import { CreateDebtCommand } from "./commands/impl/create-debt.command"
import { CreateDebtRequestDto } from "./dto/request/create-debt.request.dto"
import { UpdateDebtCommand } from "./commands/impl/update-debt.command"
import { FindDebtsByUserQuery } from "./queries/impl/find-debt-by-user.query"
import { FindDebtByIdQuery } from "./queries/impl/find-debt-by-id.query"

@Injectable()
export class DebtService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  async createDebt(userId: string, requestBody: CreateDebtRequestDto) {
    try {
      return await this.commandBus.execute<CreateDebtCommand, Debt>(
        new CreateDebtCommand(userId, requestBody)
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async findMyDebts(userId: string) {
    try {
      const debts = await this.queryBus.execute<FindDebtsByUserQuery, Debt[]>(
        new FindDebtsByUserQuery(userId)
      )

      return await Promise.all(
        debts.map(async (debt) => {
          return {
            ...(debt.toObject?.() ?? debt),
            presentValuation: 0, //tbd
          }
        })
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async findDebtById(reqUserId: string, debtId: string) {
    try {
      const debt = await this.queryBus.execute<FindDebtByIdQuery, Debt>(
        new FindDebtByIdQuery(reqUserId, debtId)
      )

      return {
        ...(debt.toObject?.() ?? debt),
        presentValuation: 0, //tbd
      }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async updateDebtById(
    userId: string,
    debtId: string,
    requestBody: CreateDebtRequestDto
  ) {
    try {
      return await this.commandBus.execute<UpdateDebtCommand, Debt>(
        new UpdateDebtCommand(userId, debtId, requestBody)
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async deleteDebt(reqUserId: string, debtId: string) {
    try {
      const { userId } = await this.queryBus.execute<FindDebtByIdQuery, Debt>(
        new FindDebtByIdQuery(reqUserId, debtId)
      )
      if (userId.toString() === reqUserId) {
        await this.commandBus.execute(new DeleteDebtCommand(debtId))
        return { success: true }
      }

      throw new BadRequestException(statusMessages.connectionError)
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }
}
