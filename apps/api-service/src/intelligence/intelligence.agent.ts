import { Portfolio } from "@/core/portfolio/schemas/portfolio.schema"
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
      await this.eventEmitter.emitAsync(EventMap.GetTotalPortfolio, userId)
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

  private async getPortfolioValuation(
    userId: string,
    portfolioName: string
  ): Promise<number> {
    const portfolio: Portfolio = (
      await this.eventEmitter.emitAsync(
        EventMap.FindPortfolioByName,
        userId,
        portfolioName
      )
    ).shift()

    const valuation: number = (
      await this.eventEmitter.emitAsync(
        EventMap.GetPortfolioValuation,
        userId,
        String(portfolio._id)
      )
    ).shift()

    return valuation
  }

  public getPortfolioValuationAgent = tool(
    async ({
      userId,
      portfolioName,
    }: {
      userId: string
      portfolioName: string
    }) => {
      const valuation = await this.getPortfolioValuation(userId, portfolioName)
      return `Valuation is ${valuation}`
    },
    {
      name: "get_portfolio_valuation_by_portfolio_name",
      description: "Get portfolio valuation for a specific portfolio",
      schema: z.object({
        userId: z.string().describe("_id of the user"),
        portfolioName: z.string().describe("portfolio name given by the user"),
      }),
    }
  )

  private async getPortfolioList(userId: string): Promise<string> {
    const portfolios: Portfolio[] = await this.eventEmitter.emitAsync(
      EventMap.GetPortfolioList,
      userId
    )

    return JSON.stringify(portfolios)
  }

  public getPortfolioListAgent = tool(
    async ({ userId }: { userId: string }) => {
      return await this.getPortfolioList(userId)
    },
    {
      name: "get_portfolio-list",
      description: "Get portfolio list for a user",
      schema: z.object({
        userId: z.string().describe("_id of the user"),
      }),
    }
  )

  private async createPortfolio(
    userId: string,
    portfolioName: string,
    institutionType: string
  ) {
    await this.eventEmitter.emitAsync(EventMap.CreatePortfolio, userId, {
      portfolioName,
      institutionType,
    })
  }

  public createPortfolioAgent = tool(
    async ({
      userId,
      portfolioName,
      institutionType,
    }: {
      userId: string
      portfolioName: string
      institutionType: string
    }) => {
      await this.createPortfolio(userId, portfolioName, institutionType)
    },
    {
      name: "create_a_portfolio",
      description: "Create a portfolio for a user",
      schema: z.object({
        userId: z.string().describe("_id of the user"),
        portfolioName: z.string().describe("portfolio name given by the user"),
        institutionType: z
          .string()
          .describe("institution type given by the user"),
      }),
    }
  )
}
