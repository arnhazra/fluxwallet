"use client"
import { useUserContext } from "@/context/user.provider"
import { Card, CardContent } from "@/shared/components/ui/card"
import { formatCurrency } from "@/shared/lib/format-currency"
import { TrendingDown } from "lucide-react"
import IconContainer from "../icon-container"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { TotalDebtDetails } from "@/shared/constants/types"

export default function LiabilityCard() {
  const [{ user }] = useUserContext()

  const { data } = useQuery<TotalDebtDetails>({
    queryKey: ["get-total-debt"],
    queryUrl: `${endPoints.debt}/total`,
    method: HTTPMethods.POST,
  })

  return (
    <Card className="bg-background border border-border relative overflow-hidden hover:shadow-md hover:shadow-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-300">Current Liabilities</span>
          <IconContainer>
            <TrendingDown className="h-5 w-5" />
          </IconContainer>
        </div>
        <div className="space-y-3">
          <p className="text-3xl font-bold text-white">
            {formatCurrency(data?.remainingDebt ?? 0, user.baseCurrency)}
          </p>
          <div className="space-y-2">
            <p className="text-sm text-neutral-300">
              Your total remaining liabilities
            </p>
            <span className="text-sm text-neutral-300">
              This is the amount you owe
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
