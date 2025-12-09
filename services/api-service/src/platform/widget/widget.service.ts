import { EventMap } from "@/shared/constants/event.map"
import { Injectable } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"

@Injectable()
export class WidgetService {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  async getWidgets(userId: string) {
    try {
      const wealthData = (
        await this.eventEmitter.emitAsync(EventMap.GetTotalWealth, userId)
      ).shift()
      const debtData = (
        await this.eventEmitter.emitAsync(EventMap.GetTotalDebt, userId)
      ).shift()
      const goalData = (
        await this.eventEmitter.emitAsync(EventMap.GetNearestGoal, userId)
      ).shift()
      const expenseData = (
        await this.eventEmitter.emitAsync(EventMap.GetExpenseByMonth, userId)
      ).shift()

      const goalPercentage =
        ((wealthData ?? 0) * 100) / (goalData?.goalAmount ?? 0) || 0
      const widgets = [
        {
          icon: "TrendingUp",
          title: "Total Assets",
          value: Number(wealthData),
          additionalInfo: "Sum of all assets",
        },
        {
          icon: "PiggyBank",
          title: "Current Month Expense",
          value: Number(expenseData.total),
          additionalInfo: `Expense for ${String(new Date().getMonth() + 1).padStart(2, "0")}-${new Date().getFullYear()}`,
        },
        {
          icon: "TrendingDown",
          title: "Current Liabilities",
          value: Number(debtData.remainingDebt),
          additionalInfo: `EMI: ${Number(debtData.totalEMI).toFixed(0)}`,
        },
        {
          icon: "GoalIcon",
          title: "Goal Progress",
          value: Number(goalData.goalAmount),
          additionalInfo: `${goalPercentage >= 100 ? 100 : goalPercentage.toFixed(0)}% Complete`,
        },
      ]
      return widgets
    } catch (error) {
      throw error
    }
  }
}
