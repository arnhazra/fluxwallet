"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Debt, Goal } from "@/shared/types"
import { useRouter } from "nextjs-toploader/app"
import { useEffect } from "react"
import notify from "@/shared/hooks/use-notify"
import { uiConstants } from "@/shared/constants/global-constants"
import { useSearchParams } from "next/navigation"
import LiabilityCard from "@/shared/components/dashboard-cards/liability-card"
import { AddGoalCard, GoalCard } from "@/shared/components/goalcard"
import EMICard from "@/shared/components/dashboard-cards/emi-card"
import PrincipalCard from "@/shared/components/dashboard-cards/debt-card"

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const debts = useQuery<Goal[]>({
    queryKey: ["get-goals"],
    queryUrl: endPoints.goal,
    method: HTTPMethods.GET,
  })

  const renderDebts = debts?.data?.map((debt) => (
    <GoalCard goal={debt} key={debt._id} />
  ))

  useEffect(() => {
    const subscriptionSuccess = searchParams.get("subscriptionSuccess")
    if (subscriptionSuccess !== null) {
      if (subscriptionSuccess === "true") {
        notify(uiConstants.subscriptionSuccess, "success")
      }

      if (subscriptionSuccess === "false") {
        notify(uiConstants.subscriptionFailed, "error")
      }
      router.push("/dashboard")
    }
  }, [searchParams])

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <section>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PrincipalCard />
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
