import { BadRequestException, Injectable } from "@nestjs/common"
import { statusMessages } from "@/shared/constants/status-messages"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { FindAllAssetQuery } from "./queries/impl/find-all-assets.query"
import { FindAssetByIdQuery } from "./queries/impl/find-asset-by-id.query"
import { Asset } from "./schemas/asset.schema"
import { DeleteAssetCommand } from "./commands/impl/delete-asset.command"
import { CreateAssetCommand } from "./commands/impl/create-asset.command"
import { CreateAssetRequestDto } from "./dto/request/create-asset.request.dto"
import { UpdateAssetCommand } from "./commands/impl/update-asset.command"

@Injectable()
export class AssetService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  async createAsset(userId: string, requestBody: CreateAssetRequestDto) {
    try {
      return await this.commandBus.execute<CreateAssetCommand, Asset>(
        new CreateAssetCommand(userId, requestBody)
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async findMyAssetsByPortfolioId(userId: string, portfolioId: string) {
    try {
      return await this.queryBus.execute<FindAllAssetQuery, Asset[]>(
        new FindAllAssetQuery(userId, portfolioId)
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async findAssetById(reqUserId: string, assetId: string) {
    try {
      return await this.queryBus.execute<FindAssetByIdQuery, Asset>(
        new FindAssetByIdQuery(reqUserId, assetId)
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async updateAssetById(
    userId: string,
    assetId: string,
    requestBody: CreateAssetRequestDto
  ) {
    try {
      return await this.commandBus.execute<UpdateAssetCommand, Asset>(
        new UpdateAssetCommand(userId, assetId, requestBody)
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async deleteAsset(reqUserId: string, assetId: string) {
    try {
      const { userId } = await this.queryBus.execute<FindAssetByIdQuery, Asset>(
        new FindAssetByIdQuery(reqUserId, assetId)
      )
      if (userId.toString() === reqUserId) {
        await this.commandBus.execute(new DeleteAssetCommand(assetId))
        return { success: true }
      } else {
        throw new BadRequestException(statusMessages.connectionError)
      }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }
}
