import { endPoints } from "@/shared/constants/api-endpoints"

export const excludedKeys = [
  "_id",
  "userId",
  "institutionId",
  "assetType",
  "assetName",
  "createdAt",
  "isMaturityApproaching",
  "isMatured",
  "debtPurpose",
]

export const amountKeys = [
  "amountInvested",
  "contributionAmount",
  "currentValuation",
  "presentValuation",
  "unitPurchasePrice",
  "valuationOnPurchase",
  "goalAmount",
  "principalAmount",
  "totalRepayment",
  "totalInterest",
  "emi",
  "remainingPrincipal",
  "remainingTotal",
]

export const editEntityUrlMap = {
  asset: "/products/wealthanalyzer/edit/asset",
  debt: "/products/debttrack/editdebt",
  goal: "/products/wealthgoal/editgoal",
}

export const deleteEntityAPIUriMap = {
  asset: endPoints.asset,
  debt: endPoints.debt,
  goal: endPoints.goal,
}

export enum EntityTypeForDetailModal {
  ASSET = "asset",
  DEBT = "debt",
  GOAL = "goal",
}
