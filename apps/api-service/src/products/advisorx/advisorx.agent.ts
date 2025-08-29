import { Asset } from "../wealthanalyzer/asset/schemas/asset.schema"
import { Institution } from "../wealthanalyzer/institution/schemas/institution.schema"
import { EventMap } from "@/shared/utils/event.map"
import { tool } from "@langchain/core/tools"
import { Injectable } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { z } from "zod"

@Injectable()
export class AdvisorXAgent {
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
}
