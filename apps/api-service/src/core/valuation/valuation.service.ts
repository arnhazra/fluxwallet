import { BadRequestException, Injectable } from "@nestjs/common"
import { Asset } from "../asset/schemas/asset.schema"
import { AssetType } from "@/shared/constants/types"
import calculateComplexValuation from "./helpers/calculate-complex-valuation"
import calculateRecurringValuation from "./helpers/calculate-recurring-valuation"
import { ValuationRepository } from "./valuation.repository"
import objectId from "@/shared/utils/convert-objectid"
import { OnEvent } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/utils/event.map"

@Injectable()
export class ValuationService {
  constructor(private readonly repository: ValuationRepository) {}

  async calculateAssetValuation(asset: Asset) {
    try {
      switch (asset.assetType) {
        case AssetType.EPF:
          return asset.currentValuation

        case AssetType.PPF:
          return asset.currentValuation

        case AssetType.CASH:
          return asset.currentValuation

        case AssetType.PROPERTY:
          return asset.currentValuation

        case AssetType.BOND:
          return asset.currentValuation

        case AssetType.METAL:
          return asset.currentValuation

        case AssetType.OTHER:
          return asset.currentValuation

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

  @OnEvent(EventMap.GetTotalPortfolio)
  async calculateTotalValuation(reqUserId: string) {
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
