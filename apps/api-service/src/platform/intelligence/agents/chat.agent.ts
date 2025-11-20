import { Debt } from "@/products/debttrack/debt/schemas/debt.schema"
import { Asset } from "@/products/wealthanalyzer/asset/schemas/asset.schema"
import { Space } from "@/products/wealthanalyzer/space/schemas/space.schema"
import { AssetType, ExpenseCategory } from "@/shared/constants/types"
import { Currency } from "country-code-enum"
import { EventMap } from "@/shared/constants/event.map"
import { tool } from "langchain"
import { Injectable } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { z } from "zod"
import { Goal } from "@/products/wealthgoal/goal/schemas/goal.schema"
import { nlDate } from "@/shared/utils/nl-date"
import { Expense } from "@/products/expensetrack/expense/schemas/expense.schema"

@Injectable()
export class ChatAgent {
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
          await this.eventEmitter.emitAsync(EventMap.GetTotalWealth, userId)
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

  public getTotalDebtTool = tool(
    async ({ userId }: { userId: string }) => {
      try {
        const valuation = (
          await this.eventEmitter.emitAsync(EventMap.GetTotalDebt, userId)
        ).shift()
        return `Total debt details is ${JSON.stringify(valuation)}`
      } catch (error) {
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

  public getAssetListTool = tool(
    async ({ userId }: { userId: string }) => {
      try {
        const assets: Asset[] = await this.eventEmitter.emitAsync(
          EventMap.GetAssetList,
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

  public getDebtListTool = tool(
    async ({
      userId,
      searchKeyword,
    }: {
      userId: string
      searchKeyword: string
    }) => {
      try {
        const debts: Debt[] = await this.eventEmitter.emitAsync(
          EventMap.GetDebtList,
          userId,
          searchKeyword
        )

        return JSON.stringify(debts)
      } catch (error) {
        return "Unable to get the debt list"
      }
    },
    {
      name: "get_debt_list",
      description: "List down all the debts for a user",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
        searchKeyword: z
          .string()
          .describe("debt name given by the user to search - this is optional"),
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
      name: "get_goal_list",
      description: "List down all goals for user",
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

  public getExpenseByMonthTool = tool(
    async ({
      userId,
      expenseMonth,
    }: {
      userId: string
      expenseMonth: string
    }) => {
      try {
        const expenses: Expense[] = await this.eventEmitter.emitAsync(
          EventMap.GetExpenseByMonth,
          userId,
          expenseMonth
        )

        return JSON.stringify(expenses)
      } catch (error) {
        return "Unable to get the expense list"
      }
    },
    {
      name: "get_expenses_by_month",
      description: "List down expenses for an user for any given month",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
        expenseMonth: z
          .string()
          .describe(
            "calculate month given by the user - format should be like 2022-05"
          ),
      }),
    }
  )

  public changeBaseCurrencyTool = tool(
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
        userId: z.string().describe("user id of the user"),
        baseCurrency: z
          .nativeEnum(Currency)
          .describe("new base currency name given by the user"),
      }),
    }
  )

  public sendEmailTool = tool(
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

  public createDebtTool = tool(
    async ({
      userId,
      debtPurpose,
      identifier,
      startDate,
      endDate,
      principalAmount,
      interestRate,
    }: {
      userId: string
      debtPurpose: string
      identifier: string
      startDate: Date
      endDate: Date
      principalAmount: number
      interestRate: number
    }) => {
      try {
        await this.eventEmitter.emitAsync(EventMap.CreateDebt, userId, {
          debtPurpose,
          identifier,
          startDate,
          endDate,
          principalAmount,
          interestRate,
        })
        return "Debt created successfully"
      } catch (error) {
        return "Failed to create the debt"
      }
    },
    {
      name: "create_debt",
      description: "Create a new debt for a user",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
        debtPurpose: z.string().describe("debt purpose given by the user"),
        identifier: z.string().describe("identifier given by the user"),
        startDate: nlDate.describe(
          `start date; natural language allowed (e.g., "next Friday", "in 2 months", "2025-01-31")`
        ),
        endDate: nlDate.describe(
          `end date; natural language allowed (e.g., "next year", "Dec 15", "2025-12-15")`
        ),
        principalAmount: z.coerce
          .number()
          .describe("principal amount given by the user"),
        interestRate: z.coerce
          .number()
          .describe("interest rate % given by the user"),
      }),
    }
  )

  public createGoalTool = tool(
    async ({
      userId,
      goalDate,
      goalAmount,
    }: {
      userId: string
      goalDate: Date
      goalAmount: number
    }) => {
      try {
        await this.eventEmitter.emitAsync(EventMap.CreateGoal, userId, {
          goalDate,
          goalAmount,
        })
        return "Goal created successfully"
      } catch (error) {
        return "Failed to create the goal"
      }
    },
    {
      name: "create_goal",
      description: "Create a new goal for a user",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
        goalDate: nlDate.describe(
          `goal date; natural language allowed (e.g., "next Friday", "in 2 months", "2025-01-31")`
        ),
        goalAmount: z.coerce.number().describe("goal amount given by the user"),
      }),
    }
  )

  public createExpenseTool = tool(
    async ({
      userId,
      title,
      expenseAmount,
      expenseCategory,
      expenseDate,
    }: {
      userId: string
      title: string
      expenseAmount: number
      expenseCategory: ExpenseCategory
      expenseDate: Date
    }) => {
      try {
        await this.eventEmitter.emitAsync(EventMap.CreateExpense, userId, {
          title,
          expenseAmount,
          expenseCategory,
          expenseDate,
        })
        return "Expense created successfully"
      } catch (error) {
        return "Failed to create the expense"
      }
    },
    {
      name: "create_expense",
      description: "Create a new expense for a user",
      schema: z.object({
        userId: z.string().describe("user id of the user"),
        title: z
          .string()
          .optional()
          .describe("expense purpose given by the user - optional"),
        expenseCategory: z
          .nativeEnum(ExpenseCategory)
          .describe(
            `category of the expense - you should decide based on description user gave, if not then ask`
          ),
        expenseAmount: z.coerce
          .number()
          .describe("expense amount given by the user"),
        expenseDate: nlDate.describe(
          `expense date; natural language allowed (e.g., "Dec 15", "2025-12-15") - must not be future date`
        ),
      }),
    }
  )
}
