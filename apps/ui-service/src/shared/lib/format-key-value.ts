import { format, parseISO, isValid } from "date-fns"
import { formatCurrency } from "./format-currency"
import { Currency } from "../types"

export const excludedKeys = [
  "_id",
  "description",
  "displayName",
  "genericName",
  "isPro",
]

export function formatKey(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (str) => str.toUpperCase())
}

export function formatValue(
  value: any,
  isDate: boolean,
  isCurrency: boolean,
  baseCurrency: Currency,
  isPercentage: boolean
) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No"
  }

  if (isCurrency) {
    return formatCurrency(value, baseCurrency)
  }

  if (isPercentage) {
    return `${Number(value).toFixed(2)} %`
  }

  if (isDate && typeof value === "string") {
    const parsed = parseISO(value)
    if (isValid(parsed)) {
      return format(parsed, "dd MMM yyyy")
    }
  }

  return String(value)
}
