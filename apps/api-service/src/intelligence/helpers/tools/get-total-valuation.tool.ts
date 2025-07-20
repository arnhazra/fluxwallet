import { tool } from "@langchain/core/tools"
import { z } from "zod"

export const getTotalValuation = tool(async () => 1000000, {
  name: "get_total_valuation",
  description: "Returns total asset valuation for a user",
  schema: z.object({}),
})
