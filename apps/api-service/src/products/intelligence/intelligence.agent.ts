import { Asset } from "../assetmanager/asset/schemas/asset.schema"
import { Institution } from "../assetmanager/institution/schemas/institution.schema"
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
      name: "get_total_institution_wealth_by_userid",
      description: "Get total institution wealth for a user",
      schema: z.object({
        userId: z.string().describe("_id of the user"),
      }),
    }
  )

  public getInstitutionValuationAgent = tool(
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
        userId: z.string().describe("_id of the user"),
        institutionName: z
          .string()
          .describe("institution name given by the user"),
      }),
    }
  )

  public getInstitutionListAgent = tool(
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
        userId: z.string().describe("_id of the user"),
      }),
    }
  )

  public getAssetListAgent = tool(
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
        userId: z.string().describe("_id of the user"),
      }),
    }
  )

  public createInstitutionAgent = tool(
    async ({
      userId,
      institutionName,
      institutionType,
    }: {
      userId: string
      institutionName: string
      institutionType: string
    }) => {
      try {
        await this.eventEmitter.emitAsync(EventMap.CreateInstitution, userId, {
          institutionName,
          institutionType,
        })
        return "Institution created successfully"
      } catch (error) {
        return "Failed to create the institution"
      }
    },
    {
      name: "create_a_institution",
      description: "Create a institution for a user",
      schema: z.object({
        userId: z.string().describe("_id of the user"),
        institutionName: z
          .string()
          .describe("institution name given by the user"),
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

  public updateWealthGoalAgent = tool(
    async ({ userId, wealthGoal }: { userId: string; wealthGoal: number }) => {
      try {
        await this.eventEmitter.emitAsync(
          EventMap.UpdateAttribute,
          userId,
          "wealthGoal",
          wealthGoal
        )
        return "success"
      } catch (error) {
        return "failure"
      }
    },
    {
      name: "update_wealth_goal_for_user",
      description: "Update the wealth goal value for a user",
      schema: z.object({
        userId: z.string().describe("_id of the user"),
        wealthGoal: z
          .number()
          .describe("new wealth goal value given by the user"),
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
