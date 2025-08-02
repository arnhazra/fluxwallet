"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Portfolio, Valuation } from "@/shared/types"
import {
  PortfolioCard,
  AddPortfolioCard,
} from "@/shared/components/portfoliocard"
import WealthCard from "./cards/wealth-card"
import LiabilityCard from "./cards/liability-card"
import GoalCard from "./cards/goal-card"

export default function Page() {
  const portfolios = useQuery<Portfolio[]>({
    queryKey: ["get-portfolios"],
    queryUrl: endPoints.portfolio,
    method: HTTPMethods.GET,
  })

  const { data } = useQuery<Valuation>({
    queryKey: ["get-total-wealth"],
    queryUrl: `${endPoints.getTotalWealth}`,
    method: HTTPMethods.GET,
  })

  const renderPortfolios = portfolios?.data?.map((portfolio) => {
    return <PortfolioCard portfolio={portfolio} key={portfolio._id} />
  })

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <section>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WealthCard
              portfolioCount={portfolios.data?.length}
              presentValuation={data?.presentValuation}
            />
            <LiabilityCard />
            <GoalCard presentValuation={data?.presentValuation ?? 0} />
          </div>
        </div>
      </section>
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
          <AddPortfolioCard />
          {renderPortfolios}
        </div>
      </section>
    </div>
  )
}
