import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import {
  ExpenseResponse,
  Goal,
  TotalDebtDetails,
  Valuation,
} from "@/shared/constants/types"
import useQuery from "@/shared/hooks/use-query"
import WidgetCard from "./widget-card"
import { GoalIcon, PiggyBank, TrendingDown, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/shared/lib/format-currency"
import { useUserContext } from "@/context/user.provider"
import { useState } from "react"
import { getNameFromMonthValue } from "@/shared/lib/generate-month-list"

export default function WidgetStack() {
  const [{ user }] = useUserContext()
  const [selectedMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
  )

  const { data: wealthData } = useQuery<Valuation>({
    queryKey: ["get-total-wealth"],
    queryUrl: `${endPoints.asset}/total-wealth`,
    method: HTTPMethods.POST,
  })

  const { data: debtData } = useQuery<TotalDebtDetails>({
    queryKey: ["get-total-debt"],
    queryUrl: `${endPoints.debt}/total-debt`,
    method: HTTPMethods.POST,
  })

  const { data: nearestGoalData } = useQuery<Goal>({
    queryKey: ["find-nearest-goal"],
    queryUrl: `${endPoints.goal}/nearest-goal`,
    method: HTTPMethods.GET,
  })

  const expenses = useQuery<ExpenseResponse>({
    queryKey: ["get-expenses"],
    queryUrl: endPoints.expense,
    method: HTTPMethods.GET,
  })

  const goalPercentage =
    ((wealthData?.presentValuation ?? 0) * 100) /
      (nearestGoalData?.goalAmount ?? 0) || 0

  return (
    <section>
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <WidgetCard
            icon={<TrendingUp className="h-5 w-5" />}
            statTitle="Total Assets"
            additionalComponent={
              <p className="text-sm text-primary">Sum of all assets</p>
            }
            statValue={wealthData?.presentValuation ?? 0}
          />
          <WidgetCard
            icon={<PiggyBank className="h-5 w-5" />}
            statTitle="Current Month Expense"
            additionalComponent={
              <p className="text-sm text-primary">
                {getNameFromMonthValue(selectedMonth)}
              </p>
            }
            statValue={expenses?.data?.total ?? 0}
          />
          <WidgetCard
            icon={<TrendingDown className="h-5 w-5" />}
            statTitle="Current Liabilities"
            additionalComponent={
              <p className="text-sm text-primary">
                EMI:{" "}
                {formatCurrency(debtData?.totalEMI ?? 0, user.baseCurrency)}
              </p>
            }
            statValue={debtData?.remainingDebt ?? 0}
          />
          <WidgetCard
            icon={<GoalIcon className="h-5 w-5" />}
            statTitle="Goal Progress"
            additionalComponent={
              <p className="text-sm text-primary">
                {goalPercentage >= 100 ? 100 : goalPercentage.toFixed(0)}%
                Complete
              </p>
            }
            statValue={nearestGoalData?.goalAmount ?? 0}
          />
        </div>
      </div>
    </section>
  )
}
