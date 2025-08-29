"use client"
import { useAppContext } from "@/context/appstate.provider"
import { Card, CardContent } from "@/shared/components/ui/card"
import { formatCurrency } from "@/shared/lib/format-currency"
import { CreditCard } from "lucide-react"
import IconContainer from "../icon-container"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { TotalDebtDetails } from "@/shared/types"

export default function LiabilityCard() {
  const [{ user }] = useAppContext()

  const { data } = useQuery<TotalDebtDetails>({
    queryKey: ["get-total-debt"],
    queryUrl: `${endPoints.debt}/total`,
    method: HTTPMethods.POST,
  })

  return (
    <Card className="bg-background border-none relative overflow-hidden hover:shadow-md hover:shadow-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <IconContainer>
              <CreditCard className="h-5 w-5" />
            </IconContainer>
            <span className="text-sm text-neutral-400">
              Current Liabilities
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-3xl font-bold text-white">
            {formatCurrency(data?.remainingDebt ?? 0, user.baseCurrency)}
          </p>
          <div className="space-y-2">
            <p className="text-sm text-neutral-400">
              Your total remaining liabilities
            </p>
            <span className="text-sm text-neutral-400">
              This is the amount you owe
            </span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 rounded-full -translate-y-10 translate-x-10"></div>
      </CardContent>
    </Card>
  )
}
