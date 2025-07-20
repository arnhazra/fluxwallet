import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Portfolio, Valuation } from "@/shared/types"
import { Landmark, Plus } from "lucide-react"
import Link from "next/link"
import useQuery from "@/shared/hooks/use-query"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import { useContext } from "react"
import { AppContext } from "@/context/appstate.provider"
import { formatCurrency } from "@/shared/lib/format-currency"

export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const [{ user }] = useContext(AppContext)
  const { data } = useQuery<Valuation>({
    queryKey: ["get-portfolio-valuation", portfolio._id],
    queryUrl: `${endPoints.getPortfolioValuation}/${portfolio._id}`,
    method: HTTPMethods.GET,
  })

  return (
    <Link href={`/portfolio/${portfolio._id}`}>
      <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-200 bg-main border-background text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold truncate text-white">
              {portfolio.portfolioName}
            </CardTitle>
            <Landmark className="text-primary w-6 h-6" />
          </div>
          <Badge variant="secondary" className="w-fit">
            {portfolio.institutionType}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Present Valuation</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(data?.presentValuation ?? 0, user.baseCurrency)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function AddPortfolioCard() {
  return (
    <Link href={`/create/portfolio`}>
      <Card className="w-full max-w-sm h-[147px] flex items-center justify-center hover:shadow-lg transition-shadow duration-200 bg-main border-background text-white">
        <Plus className="w-20 h-20 text-primary" />
      </Card>
    </Link>
  )
}
