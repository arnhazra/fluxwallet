"use client"
import GoalCard from "@/shared/components/dashboard-cards/goal-card"
import LiabilityCard from "@/shared/components/dashboard-cards/liability-card"
import WealthCard from "@/shared/components/dashboard-cards/wealth-card"
import { ProductCard } from "@/shared/components/marketing-cards"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { ProductsConfig } from "@/shared/types"

export default function Page() {
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

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <section>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WealthCard />
            <LiabilityCard />
            <GoalCard presentValuation={0} />
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
