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
import { AssetType } from "@/shared/constants/types"
import calculateComplexValuation from "./helpers/calculate-complex-valuation"
import calculateRecurringValuation from "./helpers/calculate-recurring-valuation"
import { AssetRepository } from "./asset.repository"
import objectId from "@/shared/utils/convert-objectid"

@Injectable()
export class AssetService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly repository: AssetRepository
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

  async findMyAssets(userId: string) {
    try {
      return await this.queryBus.execute<FindAllAssetQuery, Asset[]>(
        new FindAllAssetQuery(userId)
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

  async calculateCurrentValuationByAssetId(reqUserId: string, assetId: string) {
    try {
      const asset = await this.findAssetById(reqUserId, assetId)
      switch (asset.assetType) {
        case AssetType.EPF:
          return asset.currentValuation

        case AssetType.PPF:
          return asset.currentValuation

        case AssetType.CASH:
          return asset.currentValuation

        case AssetType.PROPERTY:
          return asset.valuationOnPurchase

        case AssetType.BOND:
          return asset.valuationOnPurchase

        case AssetType.METAL:
          return asset.valuationOnPurchase

        case AssetType.OTHER:
          return asset.valuationOnPurchase

        case AssetType.FD:
          return calculateComplexValuation({
            amountInvested: asset.amountInvested,
            startDate: asset.startDate,
            maturityDate: asset.maturityDate,
            expectedReturnRate: asset.expectedReturnRate,
          })

        case AssetType.MUTUAL_FUND:
          return calculateComplexValuation({
            amountInvested: asset.amountInvested,
            startDate: asset.startDate,
            maturityDate: asset.maturityDate,
            expectedReturnRate: asset.expectedReturnRate,
          })

        case AssetType.LUMPSUM:
          return calculateComplexValuation({
            amountInvested: asset.amountInvested,
            startDate: asset.startDate,
            maturityDate: asset.maturityDate,
            expectedReturnRate: asset.expectedReturnRate,
          })

        case AssetType.RD:
          return calculateRecurringValuation({
            contributionAmount: asset.contributionAmount,
            contributionFrequency: asset.contributionFrequency,
            expectedReturnRate: asset.expectedReturnRate,
            maturityDate: asset.maturityDate,
            startDate: asset.startDate,
          })

        case AssetType.SIP:
          return calculateRecurringValuation({
            contributionAmount: asset.contributionAmount,
            contributionFrequency: asset.contributionFrequency,
            expectedReturnRate: asset.expectedReturnRate,
            maturityDate: asset.maturityDate,
            startDate: asset.startDate,
          })

        case AssetType.EQUITY:
          return asset.units * asset.unitPurchasePrice

        case AssetType.CRYPTO:
          return asset.units * asset.unitPurchasePrice

        default:
          return 0
      }
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async calculatePortfolioValuation(reqUserId: string, portfolioId: string) {
    try {
      const assets = await this.repository.find({
        portfolioId: objectId(portfolioId),
      })

      const valuations = await Promise.all(
        assets.map((asset) =>
          this.calculateCurrentValuationByAssetId(reqUserId, String(asset._id))
        )
      )
      const total = valuations.reduce((sum, val) => sum + val, 0)
      return total
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async calculatTotalUserePortfolioValuation(reqUserId: string) {
    try {
      const assets = await this.repository.find({
        userId: objectId(reqUserId),
      })

      const valuations = await Promise.all(
        assets.map((asset) =>
          this.calculateCurrentValuationByAssetId(reqUserId, String(asset._id))
        )
      )
      const total = valuations.reduce((sum, val) => sum + val, 0)
      return total
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
