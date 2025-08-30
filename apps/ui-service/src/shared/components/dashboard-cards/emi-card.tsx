"use client"
import { useAppContext } from "@/context/appstate.provider"
import { Card, CardContent } from "@/shared/components/ui/card"
import { formatCurrency } from "@/shared/lib/format-currency"
import { Calculator, CalendarClock } from "lucide-react"
import IconContainer from "../icon-container"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { TotalDebtDetails } from "@/shared/types"

export default function EMICard() {
  const [{ user }] = useAppContext()

  const { data } = useQuery<TotalDebtDetails>({
    queryKey: ["get-total-debt"],
    queryUrl: `${endPoints.debt}/total`,
    method: HTTPMethods.POST,
  })

  return (
    <Card className="bg-background border border-border relative overflow-hidden hover:shadow-md hover:shadow-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-300">Total EMI</span>
          <IconContainer>
            <CalendarClock className="h-5 w-5" />
          </IconContainer>
        </div>
        <div className="space-y-3">
          <p className="text-3xl font-bold text-white">
            {formatCurrency(data?.totalEMI ?? 0, user.baseCurrency)}
          </p>
          <div className="space-y-2">
            <p className="text-sm text-neutral-300">Your total EMI</p>
            <span className="text-sm text-neutral-300">
              Amount you pay monthly
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
