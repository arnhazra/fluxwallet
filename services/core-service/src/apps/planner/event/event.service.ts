import { Injectable } from "@nestjs/common"
import { statusMessages } from "@/shared/constants/status-messages"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Event } from "./schemas/event.schema"
import { DeleteEventCommand } from "./commands/impl/delete-event.command"
import { CreateEventCommand } from "./commands/impl/create-event.command"
import { CreateEventRequestDto } from "./dto/request/create-event.request.dto"
import { UpdateEventCommand } from "./commands/impl/update-event.command"
import { FindEventsByUserQuery } from "./queries/impl/find-event-by-user.query"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { AppEventMap } from "@/shared/constants/app-events.map"
import { Asset } from "@/apps/wealthanalyzer/asset/schemas/asset.schema"
import { Goal } from "@/apps/wealthgoal/goal/schemas/goal.schema"
import { Debt } from "@/apps/debttrack/debt/schemas/debt.schema"
import { Cashflow } from "@/apps/cashflow/schemas/cashflow.schema"

@Injectable()
export class EventService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async createEvent(userId: string, requestBody: CreateEventRequestDto) {
    try {
      return await this.commandBus.execute<CreateEventCommand, Event>(
        new CreateEventCommand(userId, requestBody)
      )
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async findMyEvents(userId: string) {
    try {
      const customEvents = await this.queryBus.execute<
        FindEventsByUserQuery,
        Event[]
      >(new FindEventsByUserQuery(userId))
      const assets: Asset[] = (
        await this.eventEmitter.emitAsync(AppEventMap.GetAssetList, userId)
      ).shift()
      const assetStartDateEvents = assets.map((asset) => {
        if (asset.startDate) {
          return {
            eventDate: asset.startDate,
            eventName: `Asset Start: ${asset.assetName}`,
            userId: asset.userId,
            createdAt: (asset as any).createdAt,
            _id: asset._id,
          }
        }
      })

      const assetMaturityDateEvents = assets.map((asset) => {
        if (asset.maturityDate) {
          return {
            eventDate: asset.maturityDate,
            eventName: `Asset Maturity: ${asset.assetName}`,
            userId: asset.userId,
            createdAt: (asset as any).createdAt,
            _id: asset._id,
          }
        }
      })

      const goals: Goal[] = (
        await this.eventEmitter.emitAsync(AppEventMap.GetGoalList, userId)
      ).shift()
      const goalEvents = goals.map((goal) => ({
        eventDate: goal.goalDate,
        eventName: `Goal of ${goal.goalAmount}`,
        userId: goal.userId,
        createdAt: (goal as any).createdAt,
        _id: goal._id,
      }))

      const debts: Debt[] = (
        await this.eventEmitter.emitAsync(AppEventMap.GetDebtList, userId)
      ).shift()

      const debtStartEvents = debts.map((debt) => ({
        eventDate: debt.startDate,
        eventName: `Start Debt: ${debt.debtPurpose}`,
        userId: debt.userId,
        createdAt: (debt as any).createdAt,
        _id: debt._id,
      }))

      const debtEndEvents = debts.map((debt) => ({
        eventDate: debt.endDate,
        eventName: `End Debt: ${debt.debtPurpose}`,
        userId: debt.userId,
        createdAt: (debt as any).createdAt,
        _id: debt._id,
      }))

      const nextEmiDateEvents = debts.map((debt) => ({
        eventDate: (debt as any).nextEmiDate,
        eventName: `EMI for Debt: ${debt.debtPurpose}`,
        userId: debt.userId,
        createdAt: (debt as any).createdAt,
        _id: debt._id,
      }))

      const cashflows: Cashflow[] = (
        await this.eventEmitter.emitAsync(
          AppEventMap.FindCashFlowsByUserId,
          userId
        )
      ).shift()
      const cashflowEvents = cashflows.map((cashflow) => ({
        eventDate: cashflow.nextExecutionAt,
        eventName: cashflow.description,
        userId: cashflow.userId,
        createdAt: (cashflow as any).createdAt,
        _id: cashflow._id,
      }))

      const allEvents = [
        ...customEvents,
        ...cashflowEvents,
        ...goalEvents,
        ...debtStartEvents,
        ...debtEndEvents,
        ...nextEmiDateEvents,
        ...assetStartDateEvents,
        ...assetMaturityDateEvents,
      ].filter((event) => !!event)

      return allEvents
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async updateEventById(
    userId: string,
    eventId: string,
    requestBody: CreateEventRequestDto
  ) {
    try {
      return await this.commandBus.execute<UpdateEventCommand, Event>(
        new UpdateEventCommand(userId, eventId, requestBody)
      )
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async deleteEvent(reqUserId: string, eventId: string) {
    try {
      await this.commandBus.execute(new DeleteEventCommand(eventId))
      return { success: true }
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }
}
