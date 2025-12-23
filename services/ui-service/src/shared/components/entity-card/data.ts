import { imageUrls } from "@/shared/constants/global-constants"
import {
  Article,
  Asset,
  Cashflow,
  Debt,
  Goal,
  Space,
} from "@/shared/constants/types"

export enum EntityType {
  ASSET = "asset",
  SPACE = "space",
  DEBT = "debt",
  GOAL = "goal",
  NEWS = "news",
  EXPENSE = "expense",
  CASHFLOW = "cashflow",
}

export type EntityMap = {
  [EntityType.ASSET]: Asset
  [EntityType.SPACE]: Space
  [EntityType.DEBT]: Debt
  [EntityType.GOAL]: Goal
  [EntityType.NEWS]: Article
  [EntityType.CASHFLOW]: Cashflow
}

export const entityImageMap = {
  [EntityType.ASSET]: imageUrls.asset,
  [EntityType.SPACE]: imageUrls.space,
  [EntityType.DEBT]: imageUrls.debt,
  [EntityType.GOAL]: imageUrls.goal,
  [EntityType.NEWS]: imageUrls.newsFallback,
  [EntityType.CASHFLOW]: imageUrls.goal,
}

export const createEntityUrlMap = {
  [EntityType.ASSET]: "/apps/wealthanalyzer/create/asset",
  [EntityType.DEBT]: "/apps/debttrack/createdebt",
  [EntityType.SPACE]: "/apps/wealthanalyzer/create/space",
  [EntityType.GOAL]: "/apps/wealthgoal/createoreditgoal",
  [EntityType.NEWS]: "/apps/discover",
  [EntityType.EXPENSE]: "/apps/expensetrack/createexpense",
  [EntityType.CASHFLOW]: "/apps/cashflow/create",
}
