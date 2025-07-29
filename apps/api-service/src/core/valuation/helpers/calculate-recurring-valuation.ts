import { RecurringFrequency } from "@/shared/constants/types"

interface FnArgs {
  startDate: Date
  maturityDate: Date
  contributionAmount: number
  contributionFrequency: RecurringFrequency
  expectedReturnRate: number
}

export default function calculateRecurringValuation(args: FnArgs): number {
  const {
    startDate,
    maturityDate,
    contributionAmount,
    contributionFrequency,
    expectedReturnRate,
  } = args

  const today = new Date()
  const effectiveDate = today > maturityDate ? maturityDate : today
  const diffInMs = effectiveDate.getTime() - startDate.getTime()
  if (diffInMs < 0) return 0
  const days = diffInMs / (1000 * 60 * 60 * 24)
  const years = days / 365
  let n: number

  switch (contributionFrequency) {
    case RecurringFrequency.MONTHLY:
      n = 12
      break
    case RecurringFrequency.QUARTERLY:
      n = 4
      break
    case RecurringFrequency.HALF_YEARLY:
      n = 2
      break
    case RecurringFrequency.YEARLY:
      n = 1
      break
    default:
      throw new Error("Invalid contribution frequency")
  }

  const r = expectedReturnRate / 100
  const totalPeriods = Math.floor(n * years)
  if (totalPeriods === 0) return contributionAmount
  const ratePerPeriod = r / n
  const amount =
    contributionAmount *
    ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) /
      (1 - Math.pow(1 + ratePerPeriod, -1)))

  return Number(amount.toFixed(2))
}
