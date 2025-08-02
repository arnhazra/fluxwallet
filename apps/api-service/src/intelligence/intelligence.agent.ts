import { Portfolio } from "@/core/portfolio/schemas/portfolio.schema"
import { Currency } from "@/shared/constants/types"
import { EventMap } from "@/shared/utils/event.map"
import { tool } from "@langchain/core/tools"
import { Injectable } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { z } from "zod"

@Injectable()
export class IntelligenceAgent {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public getTotalWealthAgent = tool(
    async ({ userId }: { userId: string }) => {
      try {
        const valuation: number = (
          await this.eventEmitter.emitAsync(EventMap.GetTotalWealth, userId)
        ).shift()
        return `Total wealth is ${valuation}`
      } catch (error) {
        return "Unable to get total wealth"
      }
    },
    {
      name: "get_total_portfolio_wealth_by_userid",
      description: "Get total portfolio wealth for a user",
      schema: z.object({
        userId: z.string().describe("_id of the user"),
      }),
    }
  )

  public getPortfolioValuationAgent = tool(
    async ({
      userId,
      portfolioName,
    }: {
      userId: string
      portfolioName: string
    }) => {
      try {
        const portfolio: any = (
          await this.eventEmitter.emitAsync(
            EventMap.FindPortfolioByName,
            userId,
            portfolioName
          )
        ).shift()
        const valuation = portfolio.presentValuation ?? 0
        return `Valuation is ${valuation}`
      } catch (error) {
        return "Unable to get the valuation"
      }
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

  public getPortfolioListAgent = tool(
    async ({ userId }: { userId: string }) => {
      try {
        const portfolios: Portfolio[] = await this.eventEmitter.emitAsync(
          EventMap.GetPortfolioList,
          userId
        )

        return JSON.stringify(portfolios)
      } catch (error) {
        return "Unable to get the portfolio list"
      }
    },
    {
      name: "get_portfolio-list",
      description: "Get portfolio list for a user",
      schema: z.object({
        userId: z.string().describe("_id of the user"),
      }),
    }
  )

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
      try {
        await this.eventEmitter.emitAsync(EventMap.CreatePortfolio, userId, {
          portfolioName,
          institutionType,
        })
        return "Portfolio created successfully"
      } catch (error) {
        return "Failed to create the portfolio"
      }
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

  public changeBaseCurrencyAgent = tool(
    async ({
      userId,
      baseCurrency,
    }: {
      userId: string
      baseCurrency: Currency
    }) => {
      try {
        await this.eventEmitter.emitAsync(
          EventMap.UpdateAttribute,
          userId,
          "baseCurrency",
          baseCurrency
        )
        return "success"
      } catch (error) {
        return "failure"
      }
    },
    {
      name: "change_base_currency",
      description: "Change base currency for a user",
      schema: z.object({
        userId: z.string().describe("_id of the user"),
        baseCurrency: z
          .string()
          .describe("new base currency name given by the user"),
      }),
    }
  )

  public updateLiabilityAgent = tool(
    async ({
      userId,
      currentLiabilities,
    }: {
      userId: string
      currentLiabilities: number
    }) => {
      try {
        await this.eventEmitter.emitAsync(
          EventMap.UpdateAttribute,
          userId,
          "currentLiabilities",
          currentLiabilities
        )
        return "success"
      } catch (error) {
        return "failure"
      }
    },
    {
      name: "update_liability_for_user",
      description: "Update the liability value for a user",
      schema: z.object({
        userId: z.string().describe("_id of the user"),
        currentLiabilities: z
          .number()
          .describe("new current liabilities value given by the user"),
      }),
    }
  )

  public updatePortfolioGoalAgent = tool(
    async ({
      userId,
      portfolioGoal,
    }: {
      userId: string
      portfolioGoal: number
    }) => {
      try {
        await this.eventEmitter.emitAsync(
          EventMap.UpdateAttribute,
          userId,
          "portfolioGoal",
          portfolioGoal
        )
        return "success"
      } catch (error) {
        return "failure"
      }
    },
    {
      name: "update_portfolio_goal_for_user",
      description: "Update the portfolio goal value for a user",
      schema: z.object({
        userId: z.string().describe("_id of the user"),
        portfolioGoal: z.number().describe("new goal value given by the user"),
      }),
    }
  )

  public sendEmailAgent = tool(
    async ({
      email,
      subject,
      body,
    }: {
      email: string
      subject: string
      body: string
    }) => {
      try {
        await this.eventEmitter.emitAsync(EventMap.SendEmail, {
          email,
          subject,
          body,
        })
        return "success"
      } catch (error) {
        return "failure"
      }
    },
    {
      name: "send_details_to_user_email",
      description: "Email the details to user as per user requirement",
      schema: z.object({
        email: z.string().describe("email of the user"),
        subject: z.string().describe("a valid email subject"),
        body: z.string().describe("an email body in HTML tabular format"),
      }),
    }
  )
}
