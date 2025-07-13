"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Portfolio } from "@/shared/types"
import {
  PortfolioCard,
  AddPortfolioCard,
} from "@/shared/components/portfoliocard"

export default function Page() {
  const portfolios = useQuery<Portfolio[]>({
    queryKey: ["get-portfolios"],
    queryUrl: endPoints.portfolio,
    method: HTTPMethods.GET,
  })

  const renderPortfolios = portfolios?.data?.map((portfolio) => {
    return <PortfolioCard portfolio={portfolio} key={portfolio._id} />
  })

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
          {renderPortfolios}
          <AddPortfolioCard />
        </div>
      </section>
    </div>
  )
}
