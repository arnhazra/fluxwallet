import { EventMap } from "@/shared/utils/event.map"
import { tool } from "@langchain/core/tools"
import { Injectable } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { z } from "zod"

@Injectable()
export class IntelligenceAgent {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  private async getTotalValuation(userId: string): Promise<number> {
    const valuation: number = (
      await this.eventEmitter.emitAsync(EventMap.GetUserPortfolio, userId)
    ).shift()
    return valuation
  }

  public getTotalValuationAgent = tool(
    async ({ userId }: { userId: string }) => {
      const valuation = await this.getTotalValuation(userId)
      return `Total valuation is ${valuation}`
    },
    {
      name: "get_total_portfolio_valuation_by_userid",
      description: "Get total portfolio valuation for a user",
      schema: z.object({
        userId: z.string().describe("_id of the user"),
      }),
    }
  )
}
