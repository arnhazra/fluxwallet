import { Asset } from "../wealthanalyzer/asset/schemas/asset.schema"
import { Institution } from "../wealthanalyzer/institution/schemas/institution.schema"
import { EventMap } from "@/shared/utils/event.map"
import { tool } from "@langchain/core/tools"
import { Injectable } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { z } from "zod"
import { Debt } from "../debttrack/debt/schemas/debt.schema"
import { Goal } from "../wealthgoal/goal/schemas/goal.schema"

@Injectable()
export class TaxAdvisorTools {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public getTotalWealthTool = tool(
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
      name: "get_total_institution_wealth_by_userid",
      description: "Get total institution wealth for a user",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
      }),
    }
  )

  public getTotalDebtTool = tool(
    async ({ userId }: { userId: string }) => {
      try {
        const valuation = (
          await this.eventEmitter.emitAsync(EventMap.GetTotalDebt, userId)
        ).shift()
        return `Total debt details is ${JSON.stringify(valuation)}`
      } catch (error) {
        console.log(error)
        return "Unable to get total debt"
      }
    },
    {
      name: "get_total_debt_by_userid",
      description: "Get total debt for a user",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
      }),
    }
  )

  public getInstitutionValuationTool = tool(
    async ({
      userId,
      institutionName,
    }: {
      userId: string
      institutionName: string
    }) => {
      try {
        const institution: any = (
          await this.eventEmitter.emitAsync(
            EventMap.FindInstitutionByName,
            userId,
            institutionName
          )
        ).shift()
        const valuation = institution.presentValuation ?? 0
        return `Valuation is ${valuation}`
      } catch (error) {
        return "Unable to get the valuation"
      }
    },
    {
      name: "get_institution_valuation_by_institution_name",
      description: "Get institution valuation for a specific institution",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
        institutionName: z
          .string()
          .describe("institution name given by the user"),
      }),
    }
  )

  public getInstitutionListTool = tool(
    async ({ userId }: { userId: string }) => {
      try {
        const institutions: Institution[] = await this.eventEmitter.emitAsync(
          EventMap.GetInstitutionList,
          userId
        )

        return JSON.stringify(institutions)
      } catch (error) {
        return "Unable to get the institution list"
      }
    },
    {
      name: "get_institution-list",
      description: "Get institution list for a user",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
      }),
    }
  )

  public getAssetListTool = tool(
    async ({ userId }: { userId: string }) => {
      try {
        const assets: Asset[] = await this.eventEmitter.emitAsync(
          EventMap.GetAssetList,
          userId
        )

        return JSON.stringify(assets)
      } catch (error) {
        return "Unable to get the institution list"
      }
    },
    {
      name: "get_asset_list",
      description: "Get asset list for a user",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
      }),
    }
  )

  public getDebtListTool = tool(
    async ({ userId }: { userId: string }) => {
      try {
        const debts: Debt[] = await this.eventEmitter.emitAsync(
          EventMap.GetDebtList,
          userId
        )

        return JSON.stringify(debts)
      } catch (error) {
        return "Unable to get the debt list"
      }
    },
    {
      name: "get_debt-list",
      description: "Get debt list for a user",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
      }),
    }
  )

  public getGoalListTool = tool(
    async ({ userId }: { userId: string }) => {
      try {
        const goals: Goal[] = await this.eventEmitter.emitAsync(
          EventMap.GetGoalList,
          userId
        )

        return JSON.stringify(goals)
      } catch (error) {
        return "Unable to get the goal list"
      }
    },
    {
      name: "get_goal-list",
      description: "Get goal list for a user",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
      }),
    }
  )

  public getNearestGoalTool = tool(
    async ({ userId }: { userId: string }) => {
      try {
        const goal: Goal = (
          await this.eventEmitter.emitAsync(EventMap.GetNearestGoal, userId)
        ).shift()

        return JSON.stringify(goal)
      } catch (error) {
        return "Unable to get the goal list"
      }
    },
    {
      name: "get_user_nearest_goal",
      description: "Get nearest goal of a user",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
      }),
    }
  )
}
