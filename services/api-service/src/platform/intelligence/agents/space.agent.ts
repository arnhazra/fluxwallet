import { EventMap } from "@/shared/constants/event.map"
import { tool } from "langchain"
import { Injectable } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { z } from "zod"
import { Space } from "@/apps/wealthanalyzer/space/schemas/space.schema"

@Injectable()
export class SpaceAgent {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public getSpaceValuationTool = tool(
    async ({ userId, spaceName }: { userId: string; spaceName: string }) => {
      try {
        const space: any = (
          await this.eventEmitter.emitAsync(
            EventMap.GetSpaceList,
            userId,
            spaceName
          )
        ).shift()
        const valuation = space.presentValuation ?? 0
        return `Valuation is ${valuation}`
      } catch (error) {
        return "Unable to get the valuation"
      }
    },
    {
      name: "get_space_valuation_by_space_name",
      description: "Get space valuation for a specific space",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
        spaceName: z.string().describe("space name given by the user"),
      }),
    }
  )

  public getSpaceListTool = tool(
    async ({
      userId,
      searchKeyword,
    }: {
      userId: string
      searchKeyword: string
    }) => {
      try {
        const spaces: Space[] = await this.eventEmitter.emitAsync(
          EventMap.GetSpaceList,
          userId,
          searchKeyword
        )

        return JSON.stringify(spaces)
      } catch (error) {
        return "Unable to get the space list"
      }
    },
    {
      name: "get_space_list",
      description: "Get space list for a user",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
        searchKeyword: z
          .string()
          .describe(
            "space name given by the user to search - this is optional"
          ),
      }),
    }
  )

  public createSpaceTool = tool(
    async ({ userId, spaceName }: { userId: string; spaceName: string }) => {
      try {
        await this.eventEmitter.emitAsync(EventMap.CreateSpace, userId, {
          spaceName,
        })
        return "Space created successfully"
      } catch (error) {
        return "Failed to create the space"
      }
    },
    {
      name: "create_space",
      description: "Create a space for a user",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
        spaceName: z.string().describe("space name given by the user"),
      }),
    }
  )
}
