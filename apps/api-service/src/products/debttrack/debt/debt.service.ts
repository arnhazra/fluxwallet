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
import { OnEvent } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/utils/event.map"

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

  @OnEvent(EventMap.GetTotalDebt)
  async calculateTotalDebt(reqUserId: string) {
    try {
      const debts = await this.findMyDebts(reqUserId)

      const valuations = await Promise.all(
        debts.map((debt) => this.calculateDebtDetails(debt))
      )
      const total = valuations.reduce((sum, val) => sum + val.remainingTotal, 0)
      return total
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  private calculateDebtDetails(debt: Debt) {
    const { startDate, endDate, interestRate, principalAmount } = debt

    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      throw new Error("Invalid dates on debt")
    }

    if (endDate < startDate) {
      throw new Error("End date must be after start date")
    }

    // Normalize helpers (UTC to avoid TZ midnight shenanigans)
    const asUTC = (d: Date) =>
      new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))

    const addMonthsPreserveDay = (d: Date, m: number) => {
      const u = asUTC(d)
      const y = u.getUTCFullYear()
      const mo = u.getUTCMonth()
      const day = u.getUTCDate()
      const targetMonth = mo + m
      const ty = y + Math.floor(targetMonth / 12)
      const tm = ((targetMonth % 12) + 12) % 12
      // clamp day to last day of target month
      const lastDay = new Date(Date.UTC(ty, tm + 1, 0)).getUTCDate()
      return new Date(Date.UTC(ty, tm, Math.min(day, lastDay)))
    }

    const s = asUTC(startDate)
    const e = asUTC(endDate)
    const today = asUTC(new Date())
    const dueDay = s.getUTCDate()

    // Inclusive number of scheduled EMIs (each one on the "due day")
    const rawMonths =
      (e.getUTCFullYear() - s.getUTCFullYear()) * 12 +
      (e.getUTCMonth() - s.getUTCMonth())
    const endAdjust = e.getUTCDate() >= dueDay ? 0 : -1
    const totalEmis = rawMonths + endAdjust + 1 // inclusive of end due date
    if (totalEmis <= 0) {
      throw new BadRequestException("Loan duration must be at least one EMI")
    }

    // Count how many due dates have occurred on or before 'today'
    let paidEmis = 0
    if (today >= s) {
      const rm =
        (today.getUTCFullYear() - s.getUTCFullYear()) * 12 +
        (today.getUTCMonth() - s.getUTCMonth())
      const todayAdjust = today.getUTCDate() >= dueDay ? 1 : 0
      paidEmis = Math.max(0, Math.min(totalEmis, rm + todayAdjust))
    }

    const pendingEmis = totalEmis - paidEmis

    // Next EMI date = first due date strictly after 'today'
    const nextEmiDate =
      pendingEmis > 0 ? addMonthsPreserveDay(s, paidEmis) : null

    // Interest/EMI math
    const monthlyRate = interestRate / 12 / 100
    let emi = 0
    if (monthlyRate === 0) {
      emi = principalAmount / totalEmis
    } else {
      const pow = Math.pow(1 + monthlyRate, totalEmis)
      emi = (principalAmount * monthlyRate * pow) / (pow - 1)
    }

    const totalRepayment = emi * totalEmis
    const totalInterest = totalRepayment - principalAmount

    // Remaining principal (amortized), linear if zero‑rate
    let remainingPrincipal = 0
    if (monthlyRate === 0) {
      remainingPrincipal = principalAmount * (1 - paidEmis / totalEmis)
    } else {
      const n = totalEmis
      const k = Math.min(paidEmis, n)
      const a = Math.pow(1 + monthlyRate, n)
      const b = Math.pow(1 + monthlyRate, k)
      remainingPrincipal = (principalAmount * (a - b)) / (a - 1)
    }

    // "About to end" = within 60 days of contractual end date
    const msDay = 1000 * 60 * 60 * 24
    const diffInDays = Math.ceil((e.getTime() - today.getTime()) / msDay)
    const isLoanAboutToEnd = diffInDays <= 60 && diffInDays > 0
    const isLoanExpired = today > e && paidEmis >= totalEmis
    const remainingTotal = emi * pendingEmis

    return {
      emi,
      totalRepayment,
      totalInterest,
      remainingPrincipal,
      remainingTotal,
      totalEmis,
      pendingEmis,
      paidEmis,
      nextEmiDate,
      isLoanAboutToEnd,
      isLoanExpired,
    }
  }
}
