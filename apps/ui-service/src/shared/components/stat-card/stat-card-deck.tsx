import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import { Goal, TotalDebtDetails, Valuation } from "@/shared/constants/types"
import useQuery from "@/shared/hooks/use-query"
import { useRouter } from "nextjs-toploader/app"
import StatCard from "./stat-card"
import { CalendarClock, GoalIcon, TrendingDown, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/shared/lib/format-currency"
import { useUserContext } from "@/context/user.provider"

export default function StatCardDeck() {
  const router = useRouter()
  const [{ user }] = useUserContext()

  const { data: wealthData } = useQuery<Valuation>({
    queryKey: ["get-total-wealth"],
    queryUrl: `${endPoints.asset}/total-wealth`,
    method: HTTPMethods.POST,
  })

  const { data: debtData } = useQuery<TotalDebtDetails>({
    queryKey: ["get-total-debt"],
    queryUrl: `${endPoints.debt}/total`,
    method: HTTPMethods.POST,
  })

  const { data: nearestGoalData } = useQuery<Goal>({
    queryKey: ["find-nearest-goal"],
    queryUrl: `${endPoints.goal}/nearest`,
    method: HTTPMethods.GET,
  })

  const goalPercentage =
    ((wealthData?.presentValuation ?? 0) * 100) /
    (nearestGoalData?.goalAmount ?? 0)

  return (
    <section>
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            statTitle="Total Assets"
            statDescription="Portfolio Valuation"
            additionalDescription="Sum of all active investments"
            statValue={wealthData?.presentValuation ?? 0}
          />
          <StatCard
            icon={<TrendingDown className="h-5 w-5" />}
            statTitle="Current Liabilities"
            statDescription="Total Outstanding"
            additionalDescription="Current debt balance"
            statValue={debtData?.remainingDebt ?? 0}
          />
          <StatCard
            icon={<CalendarClock className="h-5 w-5" />}
            statTitle="Monthly EMI"
            statDescription="Total Monthly Payments"
            additionalDescription="Combined EMI amount"
            statValue={debtData?.totalEMI ?? 0}
          />
          <StatCard
            icon={<GoalIcon className="h-5 w-5" />}
            statTitle="Goal Progress"
            statDescription={`${goalPercentage.toFixed(0)}% Complete`}
            additionalComponent={
              <div className="w-full bg-neutral-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full mt-4"
                  style={{ width: `${goalPercentage.toFixed(0)}%` }}
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
