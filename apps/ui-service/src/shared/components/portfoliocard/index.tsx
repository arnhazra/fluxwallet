import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Portfolio } from "@/shared/types"
import { Landmark, Plus } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/shared/lib/format-currency"
import { useAppContext } from "@/context/appstate.provider"

export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const [{ user }] = useAppContext()

  return (
    <Link href={`/portfolio/${portfolio._id}`}>
      <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-200 bg-background border-none text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold truncate text-white">
              {portfolio.portfolioName}
            </CardTitle>
            <Landmark className="text-primary w-6 h-6" />
          </div>
          <Badge
            variant="default"
            className="w-fit bg-neutral-800 text-primary"
          >
            {portfolio.institutionType}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">
                Present Valuation
              </span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(
                  portfolio?.presentValuation ?? 0,
                  user.baseCurrency
                )}
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
      <Card className="w-full max-w-sm h-[147px] flex items-center justify-center hover:shadow-lg transition-shadow duration-200 bg-background border-none text-white">
        <Plus className="w-20 h-20 text-primary" />
      </Card>
    </Link>
  )
}
