import { Injectable } from "@nestjs/common"
import { statusMessages } from "@/shared/constants/status-messages"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import {
  Cashflow,
  FlowDirection,
  FlowFrequency,
} from "./schemas/cashflow.schema"
import { DeleteCashflowCommand } from "./commands/impl/delete-cashflow.command"
import { CreateCashFlowCommand } from "./commands/impl/create-cashflow.command"
import { FindCashflowsQuery } from "./queries/impl/find-cashflows.query"
import { CreateCashFlowRequestDto } from "./dto/request/create-cashflow.request.dto"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/constants/event.map"
import { Asset } from "../wealthanalyzer/asset/schemas/asset.schema"

@Injectable()
export class CashFlowService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async create(userId: string, requestBody: CreateCashFlowRequestDto) {
    try {
      return await this.commandBus.execute<CreateCashFlowCommand, Cashflow>(
        new CreateCashFlowCommand(userId, requestBody)
      )
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async delete(reqUserId: string, cashflowId: string) {
    try {
      await this.commandBus.execute(new DeleteCashflowCommand(cashflowId))
      return { success: true }
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async executeCashFlows() {
    try {
      const cashflows = await this.queryBus.execute<
        FindCashflowsQuery,
        Cashflow[]
      >(new FindCashflowsQuery())

      cashflows.map(async (cashflow) => {
        const targetAsset: Asset = (
          await this.eventEmitter.emitAsync(
            EventMap.FindAssetById,
            String(cashflow.userId),
            String(cashflow.targetAsset)
          )
        ).shift()

        let newValuation = 0

        if (cashflow.flowDirection === FlowDirection.INWARD) {
          newValuation = targetAsset.currentValuation + cashflow.amount
        }

        if (cashflow.flowDirection === FlowDirection.OUTWARD) {
          newValuation = targetAsset.currentValuation - cashflow.amount
        }

        const updateObject = {
          spaceId: targetAsset.spaceId,
          currentValuation: newValuation,
        }

        await this.eventEmitter.emitAsync(
          EventMap.UpdateAssetById,
          String(targetAsset.userId),
          String(targetAsset._id),
          updateObject
        )

        const baseDate = cashflow.nextExecutionAt
          ? new Date(cashflow.nextExecutionAt)
          : new Date()

        let nextExecution: Date | null = null
        switch (cashflow.frequency) {
          case FlowFrequency.DAILY:
            nextExecution = new Date(baseDate.getTime() + 24 * 60 * 60 * 1000)
            break
          case FlowFrequency.WEEKLY:
            nextExecution = new Date(
              baseDate.getTime() + 7 * 24 * 60 * 60 * 1000
            )
            break
          case FlowFrequency.MONTHLY: {
            const day = baseDate.getDate()
            const month = baseDate.getMonth()
            const year = baseDate.getFullYear()
            let nextMonth = month + 1
            let nextYear = year
            if (nextMonth > 11) {
              nextMonth = 0
              nextYear++
            }
            let nextDate = new Date(
              nextYear,
              nextMonth,
              day,
              baseDate.getHours(),
              baseDate.getMinutes(),
              baseDate.getSeconds(),
              baseDate.getMilliseconds()
            )
            if (nextDate.getMonth() !== nextMonth) {
              nextDate = new Date(
                nextYear,
                nextMonth + 1,
                0,
                baseDate.getHours(),
                baseDate.getMinutes(),
                baseDate.getSeconds(),
                baseDate.getMilliseconds()
              )
            }
            nextExecution = nextDate
            break
          }
          case FlowFrequency.YEARLY: {
            const day = baseDate.getDate()
            const month = baseDate.getMonth()
            const year = baseDate.getFullYear()
            let nextYear = year + 1
            let nextDate = new Date(
              nextYear,
              month,
              day,
              baseDate.getHours(),
              baseDate.getMinutes(),
              baseDate.getSeconds(),
              baseDate.getMilliseconds()
            )
            if (nextDate.getMonth() !== month) {
              nextDate = new Date(
                nextYear,
                month + 1,
                0,
                baseDate.getHours(),
                baseDate.getMinutes(),
                baseDate.getSeconds(),
                baseDate.getMilliseconds()
              )
            }
            nextExecution = nextDate
            break
          }
          default:
            nextExecution = null
        }
        if (nextExecution) {
          cashflow.nextExecutionAt = nextExecution
          cashflow.save()
        }
      })
      return { success: true }
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }
}
