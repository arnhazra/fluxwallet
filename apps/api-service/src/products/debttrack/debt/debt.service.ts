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

  private calculateDebtDetails(debt: Debt) {
    const { startDate, endDate, interestRate, principalAmount } = debt

    const months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) +
      1

    const monthlyRate = interestRate / 12 / 100

    let emi = 0
    if (monthlyRate === 0) {
      emi = principalAmount / months
    } else {
      emi =
        (principalAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
    }

    const totalRepayment = emi * months
    const totalInterest = totalRepayment - principalAmount

    const today = new Date()
    const totalEmis = months

    let paidEmis = 0
    if (today > startDate) {
      paidEmis =
        (today.getFullYear() - startDate.getFullYear()) * 12 +
        (today.getMonth() - startDate.getMonth())
      paidEmis = Math.min(Math.max(paidEmis, 0), totalEmis)
    }

    const pendingEmis = totalEmis - paidEmis

    let nextEmiDate: Date | null = null
    if (pendingEmis > 0) {
      nextEmiDate = new Date(startDate)
      nextEmiDate.setMonth(startDate.getMonth() + paidEmis)
    }

    const diffInDays = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    )
    const isLoanAboutToEnd = diffInDays <= 60 && diffInDays > 0

    return {
      emi,
      totalRepayment,
      totalInterest,
      totalEmis,
      pendingEmis,
      paidEmis,
      nextEmiDate,
      isLoanAboutToEnd,
    }
  }

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
          const debtDetails = this.calculateDebtDetails(debt)
          return {
            ...(debt.toObject?.() ?? debt),
            ...debtDetails,
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
      const debtDetails = this.calculateDebtDetails(debt)

      return {
        ...(debt.toObject?.() ?? debt),
        ...debtDetails,
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
