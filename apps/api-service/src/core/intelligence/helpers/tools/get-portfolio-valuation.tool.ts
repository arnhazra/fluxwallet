import { tool } from "@langchain/core/tools"
import { z } from "zod"

export const getPortfolioValuation = tool(
  async ({ portfolioName }: { portfolioName: string }) => {
    switch (portfolioName.toUpperCase()) {
      case "SBI":
        return 400000
      case "HDFC":
        return 600000
      default:
        return 0
    }
  },
  {
    name: "get_portfolio_valuation",
    description: "Returns total asset valuation for a specific portfolio",
    schema: z.object({ portfolioName: z.string() }),
  }
)
