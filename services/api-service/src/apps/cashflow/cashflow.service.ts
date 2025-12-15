import { Injectable } from "@nestjs/common"
import { statusMessages } from "@/shared/constants/status-messages"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Cashflow } from "./schemas/cashflow.schema"
import { DeleteCashflowCommand } from "./commands/impl/delete-cashflow.command"
import { CreateCashFlowCommand } from "./commands/impl/create-cashflow.command"
import { FindCashflowsQuery } from "./queries/impl/find-cashflows.query"
import { CreateCashFlowRequestDto } from "./dto/request/create-cashflow.request.dto"
import { EventMap } from "@/shared/constants/event.map"

@Injectable()
export class CashFlowService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
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

  async findCashflows() {
    try {
      const cashflows = await this.queryBus.execute<
        FindCashflowsQuery,
        Cashflow[]
      >(new FindCashflowsQuery())
      console.log(cashflows)
      return cashflows
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }
}
