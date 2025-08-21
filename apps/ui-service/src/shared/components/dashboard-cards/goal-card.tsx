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
import { BanknoteIcon, Pen, Target } from "lucide-react"
import IconContainer from "../iconcontainer"

export default function GoalCard({
  presentValuation,
}: {
  presentValuation: number
}) {
  const [{ user }, dispatch] = useAppContext()
  const { prompt } = usePromptContext()
  const goalPercentage = (presentValuation * 100) / (user.wealthGoal ?? 0)

  const editGoal = async () => {
    const { hasConfirmed, value } = await prompt(
      true,
      "Wealth Goal",
      user.wealthGoal
    )

    if (hasConfirmed) {
      try {
        dispatch("setUser", { wealthGoal: Number(value) })
        await ky.patch(endPoints.updateAttribute, {
          json: {
            attributeName: "wealthGoal",
            attributeValue: Number(value),
          },
          timeout: FETCH_TIMEOUT,
        })
      } catch (error) {
        notify(uiConstants.genericError, "error")
      }
    }
  }

  return (
    <Card className="bg-background border-none relative overflow-hidden hover:shadow-md hover:shadow-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <IconContainer>
              <Target className="h-5 w-5" />
            </IconContainer>
            <span className="text-sm text-neutral-400">Goal Progress</span>
          </div>
          <Button
            onClick={editGoal}
            size="icon"
            className="p-2 bg-primary/80 hover:bg-primary/80 text-black"
          >
            <Pen className="h-4 w-4" />
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
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 rounded-full -translate-y-10 translate-x-10"></div>
      </CardContent>
    </Card>
  )
}
