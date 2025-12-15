import { Injectable } from "@nestjs/common"
import { statusMessages } from "@/shared/constants/status-messages"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Cashflow, FlowDirection } from "./schemas/cashflow.schema"
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
      })
      return { success: true }
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }
}
