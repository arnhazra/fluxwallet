import { Currency } from "../constants/types"

const MAX_STANDARD_AMOUNT = 99999

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    notation: amount > MAX_STANDARD_AMOUNT ? "compact" : "standard",
    minimumFractionDigits: amount > MAX_STANDARD_AMOUNT ? 2 : 0,
    maximumFractionDigits: amount > MAX_STANDARD_AMOUNT ? 2 : 0,
  }).format(amount)
}
