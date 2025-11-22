import { Injectable } from "@nestjs/common"
import { statusMessages } from "@/shared/constants/status-messages"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Goal } from "./schemas/goal.schema"
import { DeleteGoalCommand } from "./commands/impl/delete-goal.command"
import { CreateGoalCommand } from "./commands/impl/create-goal.command"
import { CreateGoalRequestDto } from "./dto/request/create-goal.request.dto"
import { UpdateGoalCommand } from "./commands/impl/update-goal.command"
import { FindGoalsByUserQuery } from "./queries/impl/find-goal-by-user.query"
import { FindGoalByIdQuery } from "./queries/impl/find-goal-by-id.query"
import { FindNearestGoalQuery } from "./queries/impl/find-nearest-goal.query"
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/constants/event.map"

@Injectable()
export class GoalService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @OnEvent(EventMap.CreateGoal)
  async createGoal(userId: string, requestBody: CreateGoalRequestDto) {
    try {
      return await this.commandBus.execute<CreateGoalCommand, Goal>(
        new CreateGoalCommand(userId, requestBody)
      )
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  @OnEvent(EventMap.GetGoalList)
  async findMyGoals(userId: string) {
    try {
      const goals = await this.queryBus.execute<FindGoalsByUserQuery, Goal[]>(
        new FindGoalsByUserQuery(userId)
      )

      return await Promise.all(
        goals.map(async (goal) => {
          const data: { totalUsage: string | number | null | undefined } = (
            await this.eventEmitter.emitAsync(
              EventMap.GetAnalyticsTrend,
              goal._id
            )
          ).shift()
          return {
            ...(goal.toObject?.() ?? goal),
            analyticsTrend: data?.totalUsage,
          }
        })
      )
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  @OnEvent(EventMap.GetNearestGoal)
  async findNearestGoal(userId: string) {
    try {
      const goal = await this.queryBus.execute<FindNearestGoalQuery, Goal>(
        new FindNearestGoalQuery(userId)
      )
      if (goal) {
        const data: { totalUsage: string | number | null | undefined } = (
          await this.eventEmitter.emitAsync(
            EventMap.GetAnalyticsTrend,
            goal._id
          )
        ).shift()

        return {
          ...(goal.toObject?.() ?? goal),
          analyticsTrend: data?.totalUsage,
        }
      } else {
        return null
      }
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async findGoalById(reqUserId: string, goalId: string) {
    try {
      const goal = await this.queryBus.execute<FindGoalByIdQuery, Goal>(
        new FindGoalByIdQuery(reqUserId, goalId)
      )
      const data: { totalUsage: string | number | null | undefined } = (
        await this.eventEmitter.emitAsync(EventMap.GetAnalyticsTrend, goal._id)
      ).shift()
      return {
        ...(goal.toObject?.() ?? goal),
        analyticsTrend: data?.totalUsage,
      }
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async updateGoalById(
    userId: string,
    goalId: string,
    requestBody: CreateGoalRequestDto
  ) {
    try {
      return await this.commandBus.execute<UpdateGoalCommand, Goal>(
        new UpdateGoalCommand(userId, goalId, requestBody)
      )
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async deleteGoal(reqUserId: string, goalId: string) {
    try {
      const { userId } = await this.queryBus.execute<FindGoalByIdQuery, Goal>(
        new FindGoalByIdQuery(reqUserId, goalId)
      )
      if (userId.toString() === reqUserId) {
        await this.commandBus.execute(new DeleteGoalCommand(goalId))
        return { success: true }
      }

      throw new Error(statusMessages.connectionError)
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }
}
