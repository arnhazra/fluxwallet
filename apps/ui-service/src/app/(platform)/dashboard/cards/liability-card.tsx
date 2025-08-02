"use client"
import { useAppContext } from "@/context/appstate.provider"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { endPoints } from "@/shared/constants/api-endpoints"
import { uiConstants } from "@/shared/constants/global-constants"
import notify from "@/shared/hooks/use-notify"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import { formatCurrency } from "@/shared/lib/format-currency"
import { usePromptContext } from "@/shared/providers/prompt.provider"
import ky from "ky"
import { CreditCardIcon, PenIcon } from "lucide-react"

export default function LiabilityCard() {
  const [{ user }, dispatch] = useAppContext()
  const { prompt } = usePromptContext()

  const editLiabilities = async () => {
    const { hasConfirmed, value } = await prompt(
      "Total Liabilities",
      user.currentLiabilities
    )

    if (hasConfirmed) {
      try {
        dispatch("setUser", { currentLiabilities: value })
        await ky.patch(endPoints.updateAttribute, {
          json: {
            attributeName: "currentLiabilities",
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
              <CreditCardIcon className="h-5 w-5 text-green-400" />
            </div>
            <span className="text-sm text-zinc-400">Total Liabilities</span>
          </div>
          <Button
            onClick={editLiabilities}
            size="icon"
            className="p-2 bg-green-500/20 rounded-lg"
          >
            <PenIcon className="text-green-400 h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          <p className="text-3xl font-bold text-white">
            {formatCurrency(user.currentLiabilities, user.baseCurrency)}
          </p>
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Your total liabilities</p>
            <span className="text-sm text-zinc-400">
              This is the amount you owe
            </span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
      </CardContent>
    </Card>
  )
}
