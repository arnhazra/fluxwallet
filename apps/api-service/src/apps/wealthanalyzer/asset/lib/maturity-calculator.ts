import { Asset } from "../schemas/asset.schema"

export const isMatured = (asset: Asset): boolean => {
  return !!asset.maturityDate && new Date() >= new Date(asset.maturityDate)
}

export const isMaturityApproaching = (asset: Asset): boolean => {
  if (!asset.maturityDate || isMatured(asset)) {
    return false
  }

  const now = new Date()
  const maturity = new Date(asset.maturityDate)

  const thirtyDaysLater = new Date()
  thirtyDaysLater.setDate(now.getDate() + 30)

  return maturity <= thirtyDaysLater
}
