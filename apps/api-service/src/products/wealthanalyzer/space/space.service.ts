import { Injectable } from "@nestjs/common"
import { statusMessages } from "@/shared/constants/status-messages"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { FindAllSpaceQuery } from "./queries/impl/find-all-spaces.query"
import { FindSpaceByIdQuery } from "./queries/impl/find-space-by-id.query"
import { Space } from "./schemas/space.schema"
import { DeleteSpaceCommand } from "./commands/impl/delete-space.command"
import { CreateSpaceCommand } from "./commands/impl/create-space.command"
import { CreateSpaceRequestDto } from "./dto/request/create-space.request.dto"
import { UpdateSpaceCommand } from "./commands/impl/update-space.command"
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/constants/event.map"
import { AssetService } from "../asset/asset.service"

@Injectable()
export class SpaceService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly assetService: AssetService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @OnEvent(EventMap.CreateSpace)
  async createSpace(userId: string, requestBody: CreateSpaceRequestDto) {
    try {
      return await this.commandBus.execute<CreateSpaceCommand, Space>(
        new CreateSpaceCommand(userId, requestBody)
      )
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  @OnEvent(EventMap.GetSpaceList)
  async findMySpaces(userId: string, searchKeyword?: string) {
    const spaces = await this.queryBus.execute<FindAllSpaceQuery, Space[]>(
      new FindAllSpaceQuery(userId, searchKeyword)
    )

    return await Promise.all(
      spaces.map(async (space) => {
        const valuation = await this.assetService.calculateSpaceValuation(
          userId,
          space._id.toString()
        )
        const data: { totalUsage: string | number | null | undefined } = (
          await this.eventEmitter.emitAsync(
            EventMap.GetAnalyticsTrend,
            space._id
          )
        ).shift()
        return {
          ...(space.toObject?.() ?? space),
          presentValuation: valuation.total,
          assetCount: valuation.assetCount,
          analyticsTrend: data?.totalUsage,
        }
      })
    )
  }

  @OnEvent(EventMap.GetSpaceDetailsById)
  async findSpaceById(reqUserId: string, spaceId: string) {
    try {
      const space = await this.queryBus.execute<FindSpaceByIdQuery, Space>(
        new FindSpaceByIdQuery(reqUserId, spaceId)
      )

      const valuation = await this.assetService.calculateSpaceValuation(
        reqUserId,
        space._id.toString()
      )
      const data: { totalUsage: string | number | null | undefined } = (
        await this.eventEmitter.emitAsync(EventMap.GetAnalyticsTrend, space._id)
      ).shift()
      return {
        ...(space.toObject?.() ?? space),
        presentValuation: valuation.total,
        assetCount: valuation.assetCount,
        analyticsTrend: data?.totalUsage,
      }
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async updateSpaceById(
    userId: string,
    spaceId: string,
    requestBody: CreateSpaceRequestDto
  ) {
    try {
      return await this.commandBus.execute<UpdateSpaceCommand, Space>(
        new UpdateSpaceCommand(userId, spaceId, requestBody)
      )
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  async deleteSpace(reqUserId: string, spaceId: string) {
    try {
      const { userId } = await this.queryBus.execute<FindSpaceByIdQuery, Space>(
        new FindSpaceByIdQuery(reqUserId, spaceId)
      )
      if (userId.toString() === reqUserId) {
        await this.commandBus.execute(new DeleteSpaceCommand(spaceId))
        return { success: true }
      }

      throw new Error(statusMessages.connectionError)
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }
}
