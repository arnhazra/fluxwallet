"use client"
import GoalCard from "@/shared/components/dashboard-cards/goal-card"
import LiabilityCard from "@/shared/components/dashboard-cards/liability-card"
import WealthCard from "@/shared/components/dashboard-cards/wealth-card"
import { ProductCard } from "@/shared/components/marketing-cards"
import { Badge } from "@/shared/components/ui/badge"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Institution, ProductConfig, Valuation } from "@/shared/types"

export default function Page() {
  const { data } = useQuery<ProductConfig[]>({
    queryKey: ["getProductConfig"],
    queryUrl: endPoints.getProductConfig,
    method: HTTPMethods.GET,
  })

  const institutions = useQuery<Institution[]>({
    queryKey: ["get-institutions"],
    queryUrl: endPoints.institution,
    method: HTTPMethods.GET,
  })

  const { data: totalWealth } = useQuery<Valuation>({
    queryKey: ["get-total-wealth"],
    queryUrl: `${endPoints.getTotalWealth}`,
    method: HTTPMethods.GET,
  })

  const renderProductCards = () => {
    return data?.map((product) => (
      <ProductCard key={product.productName} product={product} />
    ))
  }

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <section>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WealthCard
              institutionCount={institutions.data?.length}
              presentValuation={totalWealth?.presentValuation}
            />
            <LiabilityCard />
            <GoalCard presentValuation={totalWealth?.presentValuation ?? 0} />
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
