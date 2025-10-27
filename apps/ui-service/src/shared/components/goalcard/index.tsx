import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Goal } from "@/shared/constants/types"
import { Eye, GoalIcon, Plus } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/shared/lib/format-currency"
import { useUserContext } from "@/context/user.provider"
import IconContainer from "../icon-container"
import { GoalModal } from "../goalmodal"
import { formatDate } from "@/shared/lib/format-date"
import { imageUrls } from "@/shared/constants/global-constants"
import { formatDistanceToNow } from "date-fns"
import Summarizer, { EntityType } from "../summarizer"
import { Button } from "../ui/button"

export function AddGoalCard() {
  return (
    <Link href={`/products/wealthgoal/creategoal`}>
      <Card className="w-full max-w-sm h-[22rem] flex items-center justify-center bg-background border border-border text-white hover:shadow-md hover:shadow-primary/20 duration-400">
        <Plus className="w-20 h-20 text-primary" />
      </Card>
    </Link>
  )
}

export function GoalCard({ goal }: { goal: Goal }) {
  const [{ user }] = useUserContext()

  const formattedDate = goal.createdAt
    ? formatDistanceToNow(new Date(goal.createdAt), { addSuffix: true })
    : null

  return (
    <Card className="w-full max-w-xs mx-auto h-[22rem] flex flex-col relative hover:shadow-md transition-shadow bg-background border-border text-white">
      <div className="relative aspect-video overflow-hidden bg-muted rounded-t-3xl">
        <img
          src={imageUrls.goal}
          alt={goal.goalAmount.toString()}
          className="object-cover w-full h-full transition-transform duration-300 rounded-t-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60" />
        <Badge className="absolute top-2 left-2 bg-primary/90 hover:bg-primary text-black">
          GOAL
        </Badge>
        <div className="absolute top-2 right-2">
          <IconContainer>
            <GoalIcon className="h-4 w-4" />
          </IconContainer>
        </div>
      </div>
      <CardHeader className="flex-grow">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold truncate text-white">
            {formatDate(goal.goalDate)}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-300">Goal</span>
            <span className="text-lg font-bold text-white">
              {formatCurrency(goal?.goalAmount ?? 0, user.baseCurrency)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {formattedDate && <span>{formattedDate}</span>}
            </div>
            <Summarizer entityType={EntityType.GOAL} entityId={goal._id} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <GoalModal goalDetails={goal} key={goal._id}>
          <Button
            variant="default"
            className="w-full gap-2 bg-border hover:bg-border"
          >
            View Details
            <Eye className="h-4 w-4" />
          </Button>
        </GoalModal>
      </CardFooter>
    </Card>
  )
}
