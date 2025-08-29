import { BadRequestException, Injectable } from "@nestjs/common"
import { statusMessages } from "@/shared/constants/status-messages"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { FindAssetsByInstitutionQuery } from "./queries/impl/find-assets-by-institution.query"
import { FindAssetByIdQuery } from "./queries/impl/find-asset-by-id.query"
import { Asset } from "./schemas/asset.schema"
import { DeleteAssetCommand } from "./commands/impl/delete-asset.command"
import { CreateAssetCommand } from "./commands/impl/create-asset.command"
import { CreateAssetRequestDto } from "./dto/request/create-asset.request.dto"
import { UpdateAssetCommand } from "./commands/impl/update-asset.command"
import { FindAssetsByUserQuery } from "./queries/impl/find-assets-by-user.query"
import { OnEvent } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/utils/event.map"
import { AssetType } from "@/shared/constants/types"
import calculateComplexValuation from "./lib/calculate-complex-valuation"
import calculateRecurringValuation from "./lib/calculate-recurring-valuation"

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

  async findMyAssetsByInstitutionId(userId: string, institutionId: string) {
    try {
      const assets = await this.queryBus.execute<
        FindAssetsByInstitutionQuery,
        Asset[]
      >(new FindAssetsByInstitutionQuery(userId, institutionId))

      return await Promise.all(
        assets.map(async (asset) => {
          const valuation = await this.calculateAssetValuation(asset)
          return {
            ...(asset.toObject?.() ?? asset),
            presentValuation: valuation,
          }
        })
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @OnEvent(EventMap.GetAssetList)
  async findAllMyAssets(userId: string) {
    try {
      const assets = await this.queryBus.execute<
        FindAssetsByUserQuery,
        Asset[]
      >(new FindAssetsByUserQuery(userId))

      return await Promise.all(
        assets.map(async (asset) => {
          const valuation = await this.calculateAssetValuation(asset)
          return {
            ...(asset.toObject?.() ?? asset),
            presentValuation: valuation,
          }
        })
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async findAssetById(reqUserId: string, assetId: string) {
    try {
      const asset = await this.queryBus.execute<FindAssetByIdQuery, Asset>(
        new FindAssetByIdQuery(reqUserId, assetId)
      )

      const valuation = await this.calculateAssetValuation(asset)
      return {
        ...(asset.toObject?.() ?? asset),
        presentValuation: valuation,
      }
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
      }

      throw new BadRequestException(statusMessages.connectionError)
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async calculateAssetValuation(asset: Asset) {
    try {
      const simpleValuationAssets = [
        AssetType.EPF,
        AssetType.PPF,
        AssetType.CASH,
        AssetType.SAVINGS,
        AssetType.PROPERTY,
        AssetType.BOND,
        AssetType.METAL,
        AssetType.OTHER,
      ]

      const complexValuationAssets = [AssetType.FD, AssetType.LUMPSUM]

      const recurringValuationAssets = [AssetType.RD, AssetType.SIP]

      const unitValuationAssets = [AssetType.EQUITY, AssetType.CRYPTO]

      if (simpleValuationAssets.includes(asset.assetType)) {
        return asset.currentValuation
      }

      if (complexValuationAssets.includes(asset.assetType)) {
        return calculateComplexValuation({
          amountInvested: asset.amountInvested,
          startDate: asset.startDate,
          maturityDate: asset.maturityDate,
          expectedReturnRate: asset.expectedReturnRate,
        })
      }

      if (recurringValuationAssets.includes(asset.assetType)) {
        return calculateRecurringValuation({
          contributionAmount: asset.contributionAmount,
          contributionFrequency: asset.contributionFrequency,
          expectedReturnRate: asset.expectedReturnRate,
          maturityDate: asset.maturityDate,
          startDate: asset.startDate,
        })
      }

      if (unitValuationAssets.includes(asset.assetType)) {
        return asset.units * asset.unitPurchasePrice
      }

      return 0
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async calculateInstitutionValuation(userId: string, institutionId: string) {
    try {
      const assets = await this.queryBus.execute<
        FindAssetsByInstitutionQuery,
        Asset[]
      >(new FindAssetsByInstitutionQuery(userId, institutionId))

      const valuations = await Promise.all(
        assets.map((asset) => this.calculateAssetValuation(asset))
      )
      const total = valuations.reduce((sum, val) => sum + val, 0)
      return total
    } catch (error) {
      throw new BadRequestException()
    }
  }

  @OnEvent(EventMap.GetTotalWealth)
  async calculateTotalWealth(reqUserId: string) {
    try {
      const assets = await this.queryBus.execute<
        FindAssetsByUserQuery,
        Asset[]
      >(new FindAssetsByUserQuery(reqUserId))

      const valuations = await Promise.all(
        assets.map((asset) => this.calculateAssetValuation(asset))
      )
      const total = valuations.reduce((sum, val) => sum + val, 0)
      return total
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
