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
import { PenIcon, Target } from "lucide-react"
import { useEffect, useState } from "react"

export default function GoalCard({
  presentValuation,
}: {
  presentValuation: number
}) {
  const [{ user }, dispatch] = useAppContext()
  const { prompt } = usePromptContext()
  const [goalPercentage, setGoalPercentage] = useState(0)

  useEffect(() => {
    const portfolioGoal = user.portfolioGoal ?? 0
    const goal = (presentValuation * 100) / portfolioGoal
    setGoalPercentage(goal > 100 ? 100 : goal)
  }, [presentValuation, user.portfolioGoal])

  const editGoal = async () => {
    const { hasConfirmed, value } = await prompt(
      "Portfolio Goal",
      user.portfolioGoal
    )

    if (hasConfirmed) {
      try {
        dispatch("setUser", { portfolioGoal: value })
        await ky.patch(endPoints.updateAttribute, {
          json: {
            attributeName: "portfolioGoal",
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
            <span className="text-sm text-zinc-400">Goal Progress</span>
          </div>
          <Button
            onClick={editGoal}
            size="icon"
            className="p-2 bg-green-500/20 rounded-lg"
          >
            <PenIcon className="text-green-400 h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          <p className="text-3xl font-bold text-white">
            <Show condition={!!goalPercentage}>
              {goalPercentage.toFixed(0)}%
            </Show>
            <Show condition={!goalPercentage}>Set a Goal</Show>
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">
                Wealth Goal:{" "}
                {formatCurrency(user.portfolioGoal ?? 0, user.baseCurrency)}
              </span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2">
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
