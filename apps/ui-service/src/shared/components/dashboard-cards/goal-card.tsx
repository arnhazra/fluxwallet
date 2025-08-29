"use client"
import { useAppContext } from "@/context/appstate.provider"
import Show from "@/shared/components/show"
import { Card, CardContent } from "@/shared/components/ui/card"
import { formatCurrency } from "@/shared/lib/format-currency"
import { GoalIcon } from "lucide-react"
import IconContainer from "../icon-container"

export default function GoalCard({
  presentValuation,
}: {
  presentValuation: number
}) {
  const [{ user }] = useAppContext()
  const goalPercentage = (presentValuation * 100) / (user.wealthGoal ?? 0)

  return (
    <Card className="bg-background border-none relative overflow-hidden hover:shadow-md hover:shadow-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <IconContainer>
              <GoalIcon className="h-5 w-5" />
            </IconContainer>
            <span className="text-sm text-neutral-400">Goal Progress</span>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-3xl font-bold text-white">
            <Show condition={!!user.wealthGoal}>
              {goalPercentage.toFixed(0)}%
            </Show>
            <Show condition={!user.wealthGoal}>Set a Goal</Show>
          </p>
          <div className="space-y-2">
            <div className="flex gap-1 text-sm">
              <span className="text-neutral-400">Wealth Goal:</span>
              <span className="text-primary">
                {formatCurrency(0, user.baseCurrency)}
              </span>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${goalPercentage.toFixed(0)}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 rounded-full -translate-y-10 translate-x-10"></div>
      </CardContent>
    </Card>
  )
}
