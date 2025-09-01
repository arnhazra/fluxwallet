import { EventMap } from "@/shared/utils/event.map"
import { tool } from "@langchain/core/tools"
import { Injectable } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { z } from "zod"

interface GenericToolReq {
  userId: string
  entityId: string
}

@Injectable()
export class SummarizeTools {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public getInstitutionTool = tool(
    async ({ userId, entityId }: GenericToolReq) => {
      try {
        const institution: any = (
          await this.eventEmitter.emitAsync(
            EventMap.GetInstitutionDetailsById,
            userId,
            entityId
          )
        ).shift()
        return `Here is the details of institution: ${JSON.stringify(institution)}`
      } catch (error) {
        return "Unable to get the institution details"
      }
    },
    {
      name: "get_institution_details_by_id",
      description: "Get institution details by id",
      schema: z.object({
        userId: z.string().describe("userId of the user"),
        entityId: z.string().describe("entityId id given by the user"),
      }),
    }
  )

  public getAssetTool = tool(
    async ({ userId, entityId }: GenericToolReq) => {
      try {
        const asset: any = (
          await this.eventEmitter.emitAsync(
            EventMap.GetAssetDetailsById,
            userId,
            entityId
          )
        ).shift()
        return `Here is the details of asset: ${JSON.stringify(asset)}`
      } catch (error) {
        return "Unable to get the asset details"
      }
    },
    {
      name: "get_asset_details_by_id",
      description: "Get asset details by id",
      schema: z.object({
        userId: z.string().describe("userId of the user"),
        entityId: z.string().describe("entityId id given by the user"),
      }),
    }
  )

  public getDebtTool = tool(
    async ({ userId, entityId }: GenericToolReq) => {
      try {
        const debt: any = (
          await this.eventEmitter.emitAsync(
            EventMap.GetDebtDetailsById,
            userId,
            entityId
          )
        ).shift()
        return `Here is the details of debt: ${JSON.stringify(debt)}`
      } catch (error) {
        return "Unable to get the debt details"
      }
    },
    {
      name: "get_debt_details_by_id",
      description: "Get debt details by id",
      schema: z.object({
        userId: z.string().describe("userId of the user"),
        entityId: z.string().describe("entityId given by the user"),
      }),
    }
  )

  public getGoalTool = tool(
    async ({ userId, entityId }: GenericToolReq) => {
      try {
        const goal: any = (
          await this.eventEmitter.emitAsync(
            EventMap.GetGoalDetailsById,
            userId,
            entityId
          )
        ).shift()
        return `Here is the details of goal: ${JSON.stringify(goal)}`
      } catch (error) {
        return "Unable to get the goal details"
      }
    },
    {
      name: "get_goal_details_by_id",
      description: "Get goal details by id",
      schema: z.object({
        userId: z.string().describe("userId of the user"),
        entityId: z.string().describe("entityId given by the user"),
      }),
    }
  )
}
