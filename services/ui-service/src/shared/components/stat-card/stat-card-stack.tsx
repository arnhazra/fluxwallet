import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import {
  ExpenseResponse,
  Goal,
  TotalDebtDetails,
  Valuation,
} from "@/shared/constants/types"
import useQuery from "@/shared/hooks/use-query"
import StatCard from "./stat-card"
import { GoalIcon, PiggyBank, TrendingDown, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/shared/lib/format-currency"
import { useUserContext } from "@/context/user.provider"
import { useState } from "react"
import { getNameFromMonthValue } from "@/shared/lib/generate-month-list"
import { buildQueryUrl } from "@/shared/lib/build-url"

export default function StatCardStack() {
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
    queryKey: ["get-expenses", selectedMonth],
    queryUrl: buildQueryUrl(endPoints.expense, {
      month: selectedMonth,
      category: "",
    }),
    method: HTTPMethods.GET,
  })

  const goalPercentage =
    ((wealthData?.presentValuation ?? 0) * 100) /
      (nearestGoalData?.goalAmount ?? 0) || 0

  return (
    <section>
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            statTitle="Total Assets"
            statDescription="Portfolio Valuation"
            additionalComponent={
              <p className="text-sm text-neutral-300">
                Sum of all active assets
              </p>
            }
            statValue={wealthData?.presentValuation ?? 0}
          />
          <StatCard
            icon={<PiggyBank className="h-5 w-5" />}
            statTitle="Current month expense"
            statDescription="Expense for the month of"
            additionalComponent={
              <p className="text-sm text-primary">
                {getNameFromMonthValue(selectedMonth)}
              </p>
            }
            statValue={expenses?.data?.total ?? 0}
          />
          <StatCard
            icon={<TrendingDown className="h-5 w-5" />}
            statTitle="Current Liabilities"
            statDescription="Current debt balance"
            additionalComponent={
              <p className="text-sm text-primary">
                EMI:{" "}
                {formatCurrency(debtData?.totalEMI ?? 0, user.baseCurrency)}
              </p>
            }
            statValue={debtData?.remainingDebt ?? 0}
          />
          <StatCard
            icon={<GoalIcon className="h-5 w-5" />}
            statTitle="Goal Progress"
            statDescription={`${goalPercentage >= 100 ? 100 : goalPercentage.toFixed(0)}% Complete`}
            additionalComponent={
              <div className="w-full bg-neutral-700 rounded-sm h-2">
                <div
                  className="bg-primary h-2 rounded-sm mt-4"
                  style={{
                    width: `${goalPercentage >= 100 ? 100 : goalPercentage.toFixed(0)}%`,
                  }}
                />
              </div>
            }
            statValue={nearestGoalData?.goalAmount ?? 0}
          />
        </div>
      </div>
    </section>
  )
}
