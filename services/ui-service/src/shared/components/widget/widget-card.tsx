"use client"
import { useUserContext } from "@/context/user.provider"
import { Card, CardContent } from "@/shared/components/ui/card"
import { formatCurrency } from "@/shared/lib/format-currency"
import IconContainer from "../icon-container"
import { ReactNode } from "react"
import Show from "../show"

interface StatCardProps {
  icon: ReactNode
  statTitle: string
  statValue: number
  additionalComponent?: ReactNode
}

export default function WidgetCard({
  icon,
  statTitle,
  statValue,
  additionalComponent,
}: StatCardProps) {
  const [{ user }] = useUserContext()

  return (
    <Card className="bg-background border border-border relative overflow-hidden hover:shadow-md hover:shadow-primary/20">
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-300">{statTitle}</span>
          <IconContainer>{icon}</IconContainer>
        </div>
        <div className="space-y-3">
          <p className="text-3xl font-bold text-white">
            {formatCurrency(statValue, user.baseCurrency)}
          </p>
          <div className="mt-4">
            <Show condition={!!additionalComponent}>{additionalComponent}</Show>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
