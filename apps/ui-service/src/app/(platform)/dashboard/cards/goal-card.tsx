"use client"
import { useAppContext } from "@/context/appstate.provider"
import Show from "@/shared/components/show"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { endPoints } from "@/shared/constants/api-endpoints"
import { uiConstants } from "@/shared/constants/global-constants"
import notify from "@/shared/hooks/use-notify"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import { formatCurrency } from "@/shared/lib/format-currency"
import { usePromptContext } from "@/shared/providers/prompt.provider"
import ky from "ky"
import { Pen, Target } from "lucide-react"

export default function GoalCard({
  presentValuation,
}: {
  presentValuation: number
}) {
  const [{ user }, dispatch] = useAppContext()
  const { prompt } = usePromptContext()
  const goalPercentage = (presentValuation * 100) / (user.wealthGoal ?? 0)

  const editGoal = async () => {
    const { hasConfirmed, value } = await prompt("Wealth Goal", user.wealthGoal)

    if (hasConfirmed) {
      try {
        dispatch("setUser", { wealthGoal: value })
        await ky.patch(endPoints.updateAttribute, {
          json: {
            attributeName: "wealthGoal",
            attributeValue: value,
          },
          timeout: FETCH_TIMEOUT,
        })
      } catch (error) {
        notify(uiConstants.genericError, "error")
      }
    }
  }

  return (
    <Card className="bg-background border-none relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Target className="h-5 w-5 text-green-400" />
            </div>
            <span className="text-sm text-neutral-400">Goal Progress</span>
          </div>
          <Button
            onClick={editGoal}
            size="icon"
            className="p-2 bg-green-500/20 hover:bg-green-500/20 rounded-lg"
          >
            <Pen className="text-green-400 h-4 w-4" />
          </Button>
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
                {formatCurrency(user.wealthGoal ?? 0, user.baseCurrency)}
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
        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
      </CardContent>
    </Card>
  )
}
