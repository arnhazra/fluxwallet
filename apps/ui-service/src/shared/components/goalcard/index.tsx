import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Goal } from "@/shared/types"
import { GoalIcon, Plus } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/shared/lib/format-currency"
import { useAppContext } from "@/context/appstate.provider"
import IconContainer from "../icon-container"
import { GoalModal } from "../goalmodal"
import { format } from "date-fns"

export function GoalCard({ goal }: { goal: Goal }) {
  const [{ user }] = useAppContext()

  return (
    <GoalModal goalDetails={goal} key={goal._id}>
      <Card className="w-full max-w-sm bg-background border border-border text-white cursor-pointer hover:shadow-md hover:shadow-primary/20 duration-400">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold truncate text-white">
              {format(goal.goalDate, "dd MMM yyyy")}
            </CardTitle>
            <IconContainer>
              <GoalIcon className="h-4 w-4" />
            </IconContainer>
          </div>
          <div className="flex items-center justify-between">
            <Badge
              variant="default"
              className="w-fit bg-neutral-800 hover:bg-neutral-800 text-primary -ms-1"
            >
              GOAL
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-300">Goal</span>
              <span className="text-lg font-bold text-white">
                {formatCurrency(goal?.goalAmount ?? 0, user.baseCurrency)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </GoalModal>
  )
}

export function AddGoalCard() {
  return (
    <Link href={`/products/wealthgoal/creategoal`}>
      <Card className="w-full max-w-sm h-[145px] flex items-center justify-center bg-background border border-border text-white hover:shadow-md hover:shadow-primary/20 duration-400">
        <Plus className="w-20 h-20 text-primary" />
      </Card>
    </Link>
  )
}
