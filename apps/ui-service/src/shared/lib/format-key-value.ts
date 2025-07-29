import { format, parseISO, isValid } from "date-fns"

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

export function formatValue(value: any, date: boolean) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No"
  }

  if (date && typeof value === "string") {
    const parsed = parseISO(value)
    if (isValid(parsed)) {
      return format(parsed, "dd MMM yyyy")
    }
  }

  return String(value)
}
