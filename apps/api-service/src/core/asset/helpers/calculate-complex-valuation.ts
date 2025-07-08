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
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const months = Math.round(days / 30.5)
  const quarters = Math.round(months / 3)
  if (days <= 0) return amountInvested
  const annualRate = expectedReturnRate / 100
  // DAILY compounding
  const dailyRate = annualRate / 365
  const dailyAmount = amountInvested * Math.pow(1 + dailyRate, days)
  // MONTHLY compounding
  const monthlyRate = annualRate / 12
  const monthlyAmount = amountInvested * Math.pow(1 + monthlyRate, months)
  // QUARTERLY compounding
  const quarterlyRate = annualRate / 4
  const quarterlyAmount = amountInvested * Math.pow(1 + quarterlyRate, quarters)
  // Pick what you want to return below:
  return Number(monthlyAmount.toFixed(2)) // change to dailyAmount or monthlyAmount if needed
}
