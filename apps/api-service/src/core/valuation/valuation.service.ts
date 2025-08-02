import { BadRequestException, Injectable } from "@nestjs/common"
import { Asset } from "../asset/schemas/asset.schema"
import { AssetType } from "@/shared/constants/types"
import calculateComplexValuation from "./lib/calculate-complex-valuation"
import calculateRecurringValuation from "./lib/calculate-recurring-valuation"
import { ValuationRepository } from "./valuation.repository"
import objectId from "@/shared/utils/convert-objectid"
import { OnEvent } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/utils/event.map"

@Injectable()
export class ValuationService {
  constructor(private readonly repository: ValuationRepository) {}

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

  async calculatePortfolioValuation(portfolioId: string) {
    try {
      const assets = await this.repository.find({
        portfolioId: objectId(portfolioId),
      })

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
      const assets = await this.repository.find({
        userId: objectId(reqUserId),
      })

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
