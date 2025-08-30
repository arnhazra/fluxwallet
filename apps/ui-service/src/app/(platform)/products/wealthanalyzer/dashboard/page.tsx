"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Institution } from "@/shared/types"
import {
  InstitutionCard,
  AddInstitutionCard,
} from "@/shared/components/institutioncard"
import { useRouter } from "nextjs-toploader/app"
import { useEffect } from "react"
import notify from "@/shared/hooks/use-notify"
import { uiConstants } from "@/shared/constants/global-constants"
import { useSearchParams } from "next/navigation"
import LiabilityCard from "@/shared/components/dashboard-cards/liability-card"
import WealthCard from "@/shared/components/dashboard-cards/wealth-card"
import GoalDashboardCard from "@/shared/components/dashboard-cards/goal-dashboard-card"
import EMICard from "@/shared/components/dashboard-cards/emi-card"

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const institutions = useQuery<Institution[]>({
    queryKey: ["get-institutions"],
    queryUrl: endPoints.institution,
    method: HTTPMethods.GET,
  })

  const renderInstitutions = institutions?.data?.map((institution) => (
    <InstitutionCard institution={institution} key={institution._id} />
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
          <AddInstitutionCard />
          {renderInstitutions}
        </div>
      </section>
    </div>
  )
}
