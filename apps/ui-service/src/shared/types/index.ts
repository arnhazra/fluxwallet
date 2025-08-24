export enum InstitutionType {
  BANK = "BANK",
  LOCKER = "LOCKER",
  GOVERNMENT = "GOVERNMENT",
  OTHER = "OTHER",
}

export interface ProductConfig {
  productName: string
  displayName: string
  description: string
  icon: string
}

export enum AssetType {
  FD = "FD",
  RD = "RD",
  SIP = "SIP",
  LUMPSUM = "LUMPSUM",
  METAL = "METAL",
  PROPERTY = "PROPERTY",
  BOND = "BOND",
  EPF = "EPF",
  PPF = "PPF",
  CASH = "CASH",
  SAVINGS = "SAVINGS",
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

export enum Currency {
  AED = "AED",
  AFN = "AFN",
  ALL = "ALL",
  AMD = "AMD",
  ANG = "ANG",
  AOA = "AOA",
  ARS = "ARS",
  AUD = "AUD",
  AWG = "AWG",
  AZN = "AZN",
  BAM = "BAM",
  BBD = "BBD",
  BDT = "BDT",
  BGN = "BGN",
  BHD = "BHD",
  BIF = "BIF",
  BMD = "BMD",
  BND = "BND",
  BOB = "BOB",
  BRL = "BRL",
  BSD = "BSD",
  BTN = "BTN",
  BWP = "BWP",
  BYN = "BYN",
  BZD = "BZD",
  CAD = "CAD",
  CDF = "CDF",
  CHF = "CHF",
  CLP = "CLP",
  CNY = "CNY",
  COP = "COP",
  CRC = "CRC",
  CUP = "CUP",
  CVE = "CVE",
  CZK = "CZK",
  DJF = "DJF",
  DKK = "DKK",
  DOP = "DOP",
  DZD = "DZD",
  EGP = "EGP",
  ERN = "ERN",
  ETB = "ETB",
  EUR = "EUR",
  FJD = "FJD",
  FKP = "FKP",
  FOK = "FOK",
  GBP = "GBP",
  GEL = "GEL",
  GGP = "GGP",
  GHS = "GHS",
  GIP = "GIP",
  GMD = "GMD",
  GNF = "GNF",
  GTQ = "GTQ",
  GYD = "GYD",
  HKD = "HKD",
  HNL = "HNL",
  HRK = "HRK",
  HTG = "HTG",
  HUF = "HUF",
  IDR = "IDR",
  ILS = "ILS",
  IMP = "IMP",
  INR = "INR",
  IQD = "IQD",
  IRR = "IRR",
  ISK = "ISK",
  JEP = "JEP",
  JMD = "JMD",
  JOD = "JOD",
  JPY = "JPY",
  KES = "KES",
  KGS = "KGS",
  KHR = "KHR",
  KID = "KID",
  KMF = "KMF",
  KRW = "KRW",
  KWD = "KWD",
  KYD = "KYD",
  KZT = "KZT",
  LAK = "LAK",
  LBP = "LBP",
  LKR = "LKR",
  LRD = "LRD",
  LSL = "LSL",
  LYD = "LYD",
  MAD = "MAD",
  MDL = "MDL",
  MGA = "MGA",
  MKD = "MKD",
  MMK = "MMK",
  MNT = "MNT",
  MOP = "MOP",
  MRU = "MRU",
  MUR = "MUR",
  MVR = "MVR",
  MWK = "MWK",
  MXN = "MXN",
  MYR = "MYR",
  MZN = "MZN",
  NAD = "NAD",
  NGN = "NGN",
  NIO = "NIO",
  NOK = "NOK",
  NPR = "NPR",
  NZD = "NZD",
  OMR = "OMR",
  PAB = "PAB",
  PEN = "PEN",
  PGK = "PGK",
  PHP = "PHP",
  PKR = "PKR",
  PLN = "PLN",
  PYG = "PYG",
  QAR = "QAR",
  RON = "RON",
  RSD = "RSD",
  RUB = "RUB",
  RWF = "RWF",
  SAR = "SAR",
  SBD = "SBD",
  SCR = "SCR",
  SDG = "SDG",
  SEK = "SEK",
  SGD = "SGD",
  SHP = "SHP",
  SLE = "SLE",
  SLL = "SLL",
  SOS = "SOS",
  SRD = "SRD",
  SSP = "SSP",
  STN = "STN",
  SYP = "SYP",
  SZL = "SZL",
  THB = "THB",
  TJS = "TJS",
  TMT = "TMT",
  TND = "TND",
  TOP = "TOP",
  TRY = "TRY",
  TTD = "TTD",
  TVD = "TVD",
  TWD = "TWD",
  TZS = "TZS",
  UAH = "UAH",
  UGX = "UGX",
  USD = "USD",
  UYU = "UYU",
  UZS = "UZS",
  VES = "VES",
  VND = "VND",
  VUV = "VUV",
  WST = "WST",
  XAF = "XAF",
  XCD = "XCD",
  XOF = "XOF",
  XPF = "XPF",
  YER = "YER",
  ZAR = "ZAR",
  ZMW = "ZMW",
  ZWL = "ZWL",
}

export type User = {
  _id: string
  email: string
  name: string
  role: string
  baseCurrency: Currency
  wealthGoal: number | null
  reduceCarbonEmissions: boolean
  activityLog: boolean
  hasTrial: boolean
  currentLiabilities: number
  createdAt: string
  avatar: string | null | undefined
}

export type SubscriptionConfig = {
  subscriptionName: string
  price: string
  features: string[]
}

export type Subscription = {
  _id: string
  userId: string
  price: number
  createdAt: string
  endsAt: string
}

export type ActivityTrends = {
  totalUsage: number
}

export type Thread = {
  _id: string
  threadId: string
  userId: string
  prompt: string | null | undefined
  response: string | null | undefined
  createdAt: string
}

export type Institution = {
  _id: string
  userId: string
  institutionName: string
  presentValuation: number | null | undefined
  institutionType: InstitutionType
  createdAt: string
}

export type Asset = {
  _id: string
  userId: string
  institutionId: string
  assetType: AssetType
  assetName: string
  identifier: string
  presentValuation: number | null | undefined
  startDate?: Date // FD, RD, SIP, LUMPSUM
  maturityDate?: Date // FD, RD, SIP, LUMPSUM
  amountInvested?: number // FD, LUMPSUM
  expectedReturnRate?: number // FD, RD, SIP, LUMPSUM
  contributionAmount?: number // RD, SIP
  contributionFrequency?: RecurringFrequency // RD, SIP
  valuationOnPurchase?: number // PROPERTY, BOND, METAL, OTHER
  currentValuation?: number // EPF, PPF, CASH, SAVINGS, PROPERTY, BOND, METAL, OTHER
  units?: number // EQUITY, CRYPTO
  unitPurchasePrice?: number // EQUITY, CRYPTO
}

export type Valuation = {
  presentValuation: number | null | undefined
}
