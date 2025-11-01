import { imageUrls } from "@/shared/constants/global-constants"
import {
  Article,
  Asset,
  Debt,
  Goal,
  Institution,
} from "@/shared/constants/types"

export enum EntityType {
  ASSET = "asset",
  INSTITUTION = "institution",
  DEBT = "debt",
  GOAL = "goal",
  NEWS = "news",
}

export type EntityMap = {
  [EntityType.ASSET]: Asset
  [EntityType.INSTITUTION]: Institution
  [EntityType.DEBT]: Debt
  [EntityType.GOAL]: Goal
  [EntityType.NEWS]: Article
}

export const entityImageMap = {
  [EntityType.ASSET]: imageUrls.asset,
  [EntityType.INSTITUTION]: imageUrls.institution,
  [EntityType.DEBT]: imageUrls.debt,
  [EntityType.GOAL]: imageUrls.goal,
  [EntityType.NEWS]: imageUrls.newsFallback,
}

export const createEntityUrlMap = {
  [EntityType.ASSET]: `/products/wealthanalyzer/create/asset`,
  [EntityType.DEBT]: `/products/debttrack/createdebt`,
  [EntityType.INSTITUTION]: `/products/wealthanalyzer/create/institution`,
  [EntityType.GOAL]: `/products/wealthgoal/creategoal`,
  [EntityType.NEWS]: `/products/finnews`,
}
