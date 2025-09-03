"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Goal } from "@/shared/types"
import LiabilityCard from "@/shared/components/dashboard-cards/liability-card"
import { AddGoalCard, GoalCard } from "@/shared/components/goalcard"
import EMICard from "@/shared/components/dashboard-cards/emi-card"
import WealthCard from "@/shared/components/dashboard-cards/wealth-card"
import GoalDashboardCard from "@/shared/components/dashboard-cards/goal-dashboard-card"

export default function Page() {
  const debts = useQuery<Goal[]>({
    queryKey: ["get-goals"],
    queryUrl: endPoints.goal,
    method: HTTPMethods.GET,
  })

  const renderDebts = debts?.data?.map((debt) => (
    <GoalCard goal={debt} key={debt._id} />
  ))

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <section>
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <WealthCard />
            <GoalDashboardCard />
            <LiabilityCard />
            <EMICard />
          </div>
        </div>
      </section>
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
          <AddGoalCard />
          {renderDebts}
        </div>
      </section>
    </div>
  )
}
