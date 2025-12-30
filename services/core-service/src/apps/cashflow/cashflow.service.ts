import { Injectable } from "@nestjs/common"
import { statusMessages } from "@/shared/constants/status-messages"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Cashflow, FlowDirection } from "./schemas/cashflow.schema"
import { DeleteCashflowCommand } from "./commands/impl/delete-cashflow.command"
import { CreateCashFlowCommand } from "./commands/impl/create-cashflow.command"
import { FindCashflowsQuery } from "./queries/impl/find-cashflows.query"
import { CreateCashFlowRequestDto } from "./dto/request/create-cashflow.request.dto"
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/constants/event.map"
import { Asset } from "../wealthanalyzer/asset/schemas/asset.schema"
import { FindCashflowsByUserQuery } from "./queries/impl/find-cashflows-by-user.query"
import { computeNextDate } from "./helpers/compute-next-date"

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

  @OnEvent(EventMap.FindCashFlowsByUserId)
  async findMyCashflows(userId: string, searchKeyword?: string) {
    try {
      return await this.queryBus.execute<FindCashflowsByUserQuery, Cashflow[]>(
        new FindCashflowsByUserQuery(userId, searchKeyword)
      )
    } catch (error) {
      throw new Error(error ?? statusMessages.connectionError)
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

  async processCashflow(cashflow: Cashflow) {
    const targetAsset: Asset = (
      await this.eventEmitter.emitAsync(
        EventMap.FindAssetById,
        String(cashflow.userId),
        String(cashflow.targetAsset)
      )
    ).shift()

    if (!targetAsset) return

    const delta =
      cashflow.flowDirection === FlowDirection.INWARD
        ? cashflow.amount
        : -cashflow.amount

    await this.eventEmitter.emitAsync(
      EventMap.UpdateAssetById,
      String(targetAsset.userId),
      String(targetAsset._id),
      {
        spaceId: targetAsset.spaceId,
        currentValuation: targetAsset.currentValuation + delta,
      }
    )

    cashflow.nextExecutionAt = computeNextDate(cashflow)
    await cashflow.save()
  }

  async executeCashFlows() {
    try {
      const cashflows = await this.queryBus.execute<
        FindCashflowsQuery,
        Cashflow[]
      >(new FindCashflowsQuery())

      for (const cashflow of cashflows) {
        await this.processCashflow(cashflow)
      }

      return { success: true }
    } catch {
      throw new Error(statusMessages.connectionError)
    }
  }
}
