"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Debt, Valuation } from "@/shared/types"
import { useRouter } from "nextjs-toploader/app"
import { useEffect } from "react"
import notify from "@/shared/hooks/use-notify"
import { uiConstants } from "@/shared/constants/global-constants"
import { useSearchParams } from "next/navigation"
import GoalCard from "@/shared/components/dashboard-cards/goal-card"
import LiabilityCard from "@/shared/components/dashboard-cards/liability-card"
import WealthCard from "@/shared/components/dashboard-cards/wealth-card"
import { AddDebtCard, DebtCard } from "@/shared/components/debtcard"

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const debts = useQuery<Debt[]>({
    queryKey: ["get-debts"],
    queryUrl: endPoints.debt,
    method: HTTPMethods.GET,
  })

  const { data } = useQuery<Valuation>({
    queryKey: ["get-total-wealth"],
    queryUrl: `${endPoints.getTotalWealth}`,
    method: HTTPMethods.GET,
  })

  const renderDebts = debts?.data?.map((debt) => (
    <DebtCard debt={debt} key={debt._id} />
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
            <WealthCard
              institutionCount={0}
              presentValuation={data?.presentValuation}
            />
            <LiabilityCard />
            <GoalCard presentValuation={data?.presentValuation ?? 0} />
          </div>
        </div>
      </section>
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
          <AddDebtCard />
          {renderDebts}
        </div>
      </section>
    </div>
  )
}
