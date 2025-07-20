"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Portfolio, Valuation } from "@/shared/types"
import {
  PortfolioCard,
  AddPortfolioCard,
} from "@/shared/components/portfoliocard"
import { PieChart, Target, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useContext } from "react"
import { AppContext } from "@/context/appstate.provider"
import { formatCurrency } from "@/shared/lib/format-currency"

export default function Page() {
  const [{ user }] = useContext(AppContext)
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
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-background border-none relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <PieChart className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm text-gray-400">
                      Total Portfolio
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(
                      data?.presentValuation ?? 0,
                      user.baseCurrency
                    )}
                  </p>
                  <p className="text-sm text-gray-400">Portfolio Valuation</p>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              </CardContent>
            </Card>
            <Card className="bg-background border-none relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                    </div>
                    <span className="text-sm text-gray-400">
                      Active Portfolios
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-3xl font-bold text-green-400">
                    {portfolios?.data?.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-400">
                      Total number of portfolios
                    </span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              </CardContent>
            </Card>
            <Card className="bg-background border-none relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Target className="h-5 w-5 text-purple-400" />
                    </div>
                    <span className="text-sm text-gray-400">Goal Progress</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-3xl font-bold text-white">31%</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Target: ₹100,00,000</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: "31%" }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              </CardContent>
            </Card>
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
