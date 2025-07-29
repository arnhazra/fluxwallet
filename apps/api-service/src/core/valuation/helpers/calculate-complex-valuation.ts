interface FnArgs {
  amountInvested: number
  startDate: Date
  maturityDate: Date
  expectedReturnRate: number
}

export default function calculateComplexValuation(args: FnArgs): number {
  const { amountInvested, startDate, maturityDate, expectedReturnRate } = args
  const today = new Date()
  const effectiveDate = today > maturityDate ? maturityDate : today
  const diffInMs = effectiveDate.getTime() - startDate.getTime()
  if (diffInMs <= 0) return amountInvested
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
  const quarters = diffInDays / (365.25 / 4)
  const annualRate = expectedReturnRate / 100
  const quarterlyRate = annualRate / 4
  const fullQuarters = Math.floor(quarters)
  const amount = amountInvested * Math.pow(1 + quarterlyRate, fullQuarters)
  return Number(amount.toFixed(2))
}
