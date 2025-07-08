import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Currency, Portfolio } from "@/shared/types"
import { Building2 } from "lucide-react"
import Link from "next/link"

function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  return (
    <Link href={`/portfolio/${portfolio._id}`}>
      <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-200 bg-background border-border text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold truncate text-white">
              {portfolio.portfolioName}
            </CardTitle>
            <Building2 className="text-primary w-6 h-6" />
          </div>
          <Badge variant="secondary" className="w-fit">
            {portfolio.institutionType}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Total Valuation</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(0, portfolio.baseCurrency)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Assets</span>
              <span className="text-sm font-medium">1 assets</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
