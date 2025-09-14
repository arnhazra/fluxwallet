"use client"
import { useUserContext } from "@/context/user.provider"
import { Card, CardContent } from "@/shared/components/ui/card"
import { formatCurrency } from "@/shared/lib/format-currency"
import { TrendingUp } from "lucide-react"
import IconContainer from "../icon-container"
import useQuery from "@/shared/hooks/use-query"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"

export default function WealthCard() {
  const [{ user }] = useUserContext()

  const { data } = useQuery<{
    presentValuation: number | null | undefined
  }>({
    queryKey: ["get-total-wealth"],
    queryUrl: `${endPoints.asset}/total-wealth`,
    method: HTTPMethods.POST,
  })

  return (
    <Card className="bg-background border border-border relative overflow-hidden hover:shadow-md hover:shadow-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-300">Total Assets</span>
          <IconContainer>
            <TrendingUp className="h-5 w-5" />
          </IconContainer>
        </div>
        <div className="space-y-3">
          <p className="text-3xl font-bold text-white">
            {formatCurrency(data?.presentValuation ?? 0, user.baseCurrency)}
          </p>
          <p className="text-sm text-neutral-300">Your portfolio valuation</p>
          <span className="text-sm text-neutral-300">
            Across all active holding institutions
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
