import { Injectable } from "@nestjs/common"
import { statusMessages } from "@/shared/constants/status-messages"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Expense } from "./schemas/expense.schema"
import { DeleteExpenseCommand } from "./commands/impl/delete-expense.command"
import { CreateExpenseCommand } from "./commands/impl/create-expense.command"
import { CreateExpenseRequestDto } from "./dto/request/create-expense.request.dto"
import { UpdateExpenseCommand } from "./commands/impl/update-expense.command"
import { FindExpensesByUserQuery } from "./queries/impl/find-expense-by-user.query"
import { FindExpenseByIdQuery } from "./queries/impl/find-expense-by-id.query"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/constants/event.map"
import { ExpenseCategory } from "@/shared/constants/types"
import { FindStartMonthByUserQuery } from "./queries/impl/find-start-month-by-user.query"

@Injectable()
export class ExpenseService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async createExpense(userId: string, requestBody: CreateExpenseRequestDto) {
    try {
      return await this.commandBus.execute<CreateExpenseCommand, Expense>(
        new CreateExpenseCommand(userId, requestBody)
      )
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async findMyExpenses(
    userId: string,
    monthFilter?: string,
    searchKeyword?: string,
    expenseCategory?: ExpenseCategory
  ) {
    try {
      return await this.queryBus.execute<FindExpensesByUserQuery>(
        new FindExpensesByUserQuery(
          userId,
          monthFilter,
          searchKeyword,
          expenseCategory
        )
      )
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async findExpenseById(reqUserId: string, expenseId: string) {
    try {
      const expense = await this.queryBus.execute<
        FindExpenseByIdQuery,
        Expense
      >(new FindExpenseByIdQuery(reqUserId, expenseId))
      const data: { totalUsage: string | number | null | undefined } = (
        await this.eventEmitter.emitAsync(
          EventMap.GetAnalyticsTrend,
          expense._id
        )
      ).shift()
      return {
        ...(expense.toObject?.() ?? expense),
        analyticsTrend: data?.totalUsage,
      }
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async updateExpenseById(
    userId: string,
    expenseId: string,
    requestBody: CreateExpenseRequestDto
  ) {
    try {
      return await this.commandBus.execute<UpdateExpenseCommand, Expense>(
        new UpdateExpenseCommand(userId, expenseId, requestBody)
      )
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async deleteExpense(reqUserId: string, expenseId: string) {
    try {
      const { userId } = await this.queryBus.execute<
        FindExpenseByIdQuery,
        Expense
      >(new FindExpenseByIdQuery(reqUserId, expenseId))
      if (userId.toString() === reqUserId) {
        await this.commandBus.execute(new DeleteExpenseCommand(expenseId))
        return { success: true }
      }

      throw new Error(statusMessages.connectionError)
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async findStartMonth(userId: string) {
    try {
      return await this.queryBus.execute(new FindStartMonthByUserQuery(userId))
    } catch (error) {
      throw new Error(error)
    }
  }
}
