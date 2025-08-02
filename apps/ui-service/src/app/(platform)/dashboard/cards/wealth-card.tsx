"use client"
import { useAppContext } from "@/context/appstate.provider"
import { Card, CardContent } from "@/shared/components/ui/card"
import { formatCurrency } from "@/shared/lib/format-currency"
import { BanknoteIcon } from "lucide-react"

export default function WealthCard({
  presentValuation,
  portfolioCount,
}: {
  presentValuation: number | null | undefined
  portfolioCount: number | null | undefined
}) {
  const [{ user }] = useAppContext()

  return (
    <Card className="bg-background border-none relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <BanknoteIcon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-neutral-400">Total Wealth</span>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-3xl font-bold text-white">
            {formatCurrency(presentValuation ?? 0, user.baseCurrency)}
          </p>
          <p className="text-sm text-neutral-400">Portfolio Valuation</p>
          <span className="text-sm text-neutral-400">
            Across {portfolioCount ?? 0} active portfolios
          </span>
        </div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
      </CardContent>
    </Card>
  )
}
