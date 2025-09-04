import * as chrono from "chrono-node"
import { z } from "zod"

export const nlDate = z.preprocess((val) => {
  if (val instanceof Date) return val
  if (typeof val !== "string") return val
  const parsed = chrono.parseDate(val)
  if (parsed) return parsed
  const d = new Date(val)
  return isNaN(d.getTime()) ? val : d
}, z.date())
