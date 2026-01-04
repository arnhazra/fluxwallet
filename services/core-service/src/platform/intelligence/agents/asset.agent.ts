import { AssetType } from "@/shared/constants/types"
import { AppEventMap } from "@/shared/constants/app-events.map"
import { tool } from "langchain"
import { Injectable } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { z } from "zod"
import { Asset } from "@/apps/wealthanalyzer/asset/schemas/asset.schema"

@Injectable()
export class AssetAgent {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public getAssetTypesTool = tool(
    async () => {
      return Object.values(AssetType)
    },
    {
      name: "get_asset_types",
      description: "Get types of assets",
      schema: z.object({}),
    }
  )

  public getTotalWealthTool = tool(
    async ({ userId }: { userId: string }) => {
      try {
        const valuation: number = (
          await this.eventEmitter.emitAsync(AppEventMap.GetTotalWealth, userId)
        ).shift()
        return `Total wealth is ${valuation}`
      } catch (error) {
        return "Unable to get total wealth"
      }
    },
    {
      name: "get_total_wealth_by_userid",
      description: "Get total wealth for a user",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
      }),
    }
  )

  public getAssetListTool = tool(
    async ({ userId }: { userId: string }) => {
      try {
        const assets: Asset[] = await this.eventEmitter.emitAsync(
          AppEventMap.GetAssetList,
          userId
        )

        return JSON.stringify(assets)
      } catch (error) {
        return "Unable to get the space list"
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
}
