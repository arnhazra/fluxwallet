"use client"
import EMICard from "@/shared/components/dashboard-cards/emi-card"
import GoalDashboardCard from "@/shared/components/dashboard-cards/goal-dashboard-card"
import LiabilityCard from "@/shared/components/dashboard-cards/liability-card"
import WealthCard from "@/shared/components/dashboard-cards/wealth-card"
import { ProductCard } from "@/shared/components/marketing-cards"
import { endPoints } from "@/shared/constants/api-endpoints"
import { uiConstants } from "@/shared/constants/global-constants"
import HTTPMethods from "@/shared/constants/http-methods"
import notify from "@/shared/hooks/use-notify"
import useQuery from "@/shared/hooks/use-query"
import { ProductsConfig } from "@/shared/types"
import { useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import { useEffect } from "react"

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const { data } = useQuery<ProductsConfig>({
    queryKey: ["getProductConfig"],
    queryUrl: endPoints.getProductConfig,
    method: HTTPMethods.GET,
  })

  const renderProductCards = () => {
    return data?.products?.map((product) => (
      <ProductCard key={product.productName} product={product} />
    ))
  }

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
            <LiabilityCard />
            <EMICard />
            <GoalDashboardCard />
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto grid justify-center gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-4">
          {renderProductCards()}
        </div>
      </section>
    </div>
  )
}
