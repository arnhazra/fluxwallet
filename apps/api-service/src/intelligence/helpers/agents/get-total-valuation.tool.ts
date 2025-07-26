import { tool } from "@langchain/core/tools"
import { z } from "zod"

export const getTotalValuation = tool(
  async ({ userId }: { userId: string }) => {
    return `Total valuation is 10000000`
  },
  {
    name: "get_total_portfolio_valuation_by_userid",
    description: "Get total portfolio valuation for a user",
    schema: z.object({
      userId: z.string().describe("_id of the user"),
    }),
  }
)
