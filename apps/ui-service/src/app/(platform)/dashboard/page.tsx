"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Currency, Portfolio, Valuation } from "@/shared/types"
import {
  PortfolioCard,
  AddPortfolioCard,
} from "@/shared/components/portfoliocard"
import SectionPanel from "@/shared/components/sectionpanel"
import { Building } from "lucide-react"

function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function Page() {
  const portfolios = useQuery<Portfolio[]>({
    queryKey: ["get-portfolios"],
    queryUrl: endPoints.portfolio,
    method: HTTPMethods.GET,
  })

  const { data } = useQuery<Valuation>({
    queryKey: ["get-total-valuation"],
    queryUrl: `${endPoints.getTotalValuation}`,
    method: HTTPMethods.GET,
  })

  const renderPortfolios = portfolios?.data?.map((portfolio) => {
    return <PortfolioCard portfolio={portfolio} key={portfolio._id} />
  })

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <section>
        <SectionPanel
          icon={<Building className="scale-75 text-primary" />}
          title="Portfolio Valuation"
          content={formatCurrency(data?.presentValuation ?? 0, Currency.INR)}
        />
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
