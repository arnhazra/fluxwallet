"use client"
import { useUserContext } from "@/context/user.provider"
import { Card, CardContent } from "@/shared/components/ui/card"
import { formatCurrency } from "@/shared/lib/format-currency"
import IconContainer from "../icon-container"
import { ReactNode } from "react"

interface WidgetCardProps {
  icon: ReactNode
  statTitle: string
  statValue: number
  additionalInfo: string
}

export default function WidgetCard({
  icon,
  statTitle,
  statValue,
  additionalInfo,
}: WidgetCardProps) {
  const [{ user }] = useUserContext()

  return (
    <Card className="bg-background/2 backdrop-blur-sm border border-border rounded-3xl relative overflow-hidden hover:shadow-md hover:shadow-primary/20">
      <CardContent className="-mt-2 -mb-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-300">{statTitle}</span>
          <IconContainer>{icon}</IconContainer>
        </div>
        <div className="space-y-3">
          <p className="text-2xl font-bold text-white">
            {formatCurrency(statValue, user.baseCurrency)}
          </p>
          <p className="text-sm text-primary">{additionalInfo}</p>
        </div>
      </CardContent>
    </Card>
  )
}
