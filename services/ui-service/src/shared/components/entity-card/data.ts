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

export const createEntityUrlMap = {
  [EntityType.ASSET]: "/apps/wealthanalyzer/asset/create",
  [EntityType.DEBT]: "/apps/debttrack/createoreditdebt",
  [EntityType.SPACE]: "/apps/wealthanalyzer/createoreditspace",
  [EntityType.GOAL]: "/apps/wealthgoal/createoreditgoal",
  [EntityType.NEWS]: "/apps/discover",
  [EntityType.EXPENSE]: "/apps/expensetrack/createoreditexpense",
  [EntityType.CASHFLOW]: "/apps/cashflow/create",
}
