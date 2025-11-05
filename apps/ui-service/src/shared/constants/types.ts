import { Currency } from "country-code-enum"

export enum AssetType {
  LUMPSUM_DEPOSIT = "LUMPSUM_DEPOSIT",
  RECURRING_DEPOSIT = "RECURRING_DEPOSIT",
  METAL = "METAL",
  REAL_ESTATE = "REAL_ESTATE",
  BOND = "BOND",
  LIQUID = "LIQUID",
  RETIREMENT = "RETIREMENT",
  EQUITY = "EQUITY",
  CRYPTO = "CRYPTO",
  OTHER = "OTHER",
}

export enum RecurringFrequency {
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  HALF_YEARLY = "HALF_YEARLY",
  YEARLY = "YEARLY",
}

export type User = {
  _id: string
  email: string
  name: string
  role: string
  baseCurrency: Currency
  avatar: string | null | undefined
  reduceCarbonEmissions: boolean
  analyticsData: boolean
  hasTrial: boolean
  useIntelligence: boolean
  createdAt: string
}

export type SubscriptionConfig = {
  price: string
  features: string[]
  trialSubscription: string
}

export type Subscription = {
  _id: string
  userId: string
  price: number
  createdAt: string
  endsAt: string
  isActive: boolean
}

export type Thread = {
  _id: string
  threadId: string
  userId: string
  prompt: string | null | undefined
  response: string | null | undefined
  createdAt: string
}

export type Space = {
  _id: string
  userId: string
  spaceName: string
  presentValuation: number | null | undefined
  createdAt: string
  analyticsTrend: string | number | null | undefined
}

export type Asset = {
  _id: string // COMMON
  userId: string // COMMON
  spaceId: string // COMMON
  assetType: AssetType // COMMON
  assetName: string // COMMON
  identifier: string // COMMON
  presentValuation: number | null | undefined // COMMON
  createdAt: Date // COMMON
  isMaturityApproaching: boolean // COMMON
  isMatured: boolean // COMMON
  startDate?: Date // LUMPSUM_DEPOSIT, RECURRING_DEPOSIT, BOND
  maturityDate?: Date // LUMPSUM_DEPOSIT, RECURRING_DEPOSIT, BOND
  amountInvested?: number // LUMPSUM_DEPOSIT, BOND
  expectedReturnRate?: number // LUMPSUM_DEPOSIT, RECURRING_DEPOSIT, BOND
  contributionAmount?: number // RECURRING_DEPOSIT
  contributionFrequency?: RecurringFrequency // RECURRING_DEPOSIT
  valuationOnPurchase?: number // REAL_ESTATE, METAL, OTHER
  currentValuation?: number // LIQUID, RETIREMENT, REAL_ESTATE, METAL, OTHER
  units?: number // EQUITY, CRYPTO
  unitPurchasePrice?: number // EQUITY, CRYPTO
  analyticsTrend: string | number | null | undefined
}

export type Debt = {
  _id: string
  userId: string
  debtPurpose: string
  identifier: string
  startDate: Date
  endDate: Date
  principalAmount: number
  interestRate: number
  createdAt: string
  emi: number
  totalRepayment: number
  totalInterest: number
  totalEmis: number
  pendingEmis: number
  paidEmis: number
  remainingPrincipal: number
  remainingTotal: number
  nextEmiDate: string
  isMaturityApproaching: boolean
  isMatured: boolean
  analyticsTrend: string | number | null | undefined
}

export type Goal = {
  _id: string
  userId: string
  goalDate: Date
  goalAmount: number
  createdAt: string
  analyticsTrend: string | number | null | undefined
}

export type Valuation = {
  presentValuation: number | null | undefined
}

export interface Product {
  productName: string
  displayName: string
  description: string
  icon: string
  url: string
}

export interface ProductsConfig {
  title: string
  desc: string
  products: Product[]
}

export interface Solution {
  displayName: string
  description: string
  icon: string
  vector: string
}

export interface SolutionConfig {
  title: string
  desc: string
  solutions: Solution[]
}

export interface TotalDebtDetails {
  remainingDebt: number
  totalEMI: number
  totalPrincipal: number
}

export type Article = {
  source?: {
    id?: string | null
    name?: string | null
  } | null
  author?: string | null
  title?: string | null
  description?: string | null
  url?: string | null
  urlToImage?: string | null
  publishedAt?: Date | null
  content?: string | null
}

export type FindNewsResponse = {
  status?: string | null
  totalResults?: number | null
  articles?: Article[] | null
}
