import { imageUrls } from "@/shared/constants/global-constants"
import { Article, Asset, Debt, Goal, Space } from "@/shared/constants/types"

export enum EntityType {
  ASSET = "asset",
  SPACE = "space",
  DEBT = "debt",
  GOAL = "goal",
  NEWS = "news",
}

export type EntityMap = {
  [EntityType.ASSET]: Asset
  [EntityType.SPACE]: Space
  [EntityType.DEBT]: Debt
  [EntityType.GOAL]: Goal
  [EntityType.NEWS]: Article
}

export const entityImageMap = {
  [EntityType.ASSET]: imageUrls.asset,
  [EntityType.SPACE]: imageUrls.space,
  [EntityType.DEBT]: imageUrls.debt,
  [EntityType.GOAL]: imageUrls.goal,
  [EntityType.NEWS]: imageUrls.newsFallback,
}

export const createEntityUrlMap = {
  [EntityType.ASSET]: `/products/wealthanalyzer/create/asset`,
  [EntityType.DEBT]: `/products/debttrack/createdebt`,
  [EntityType.SPACE]: `/products/wealthanalyzer/create/space`,
  [EntityType.GOAL]: `/products/wealthgoal/creategoal`,
  [EntityType.NEWS]: `/products/discover`,
}
