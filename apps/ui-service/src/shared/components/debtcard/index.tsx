import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Debt } from "@/shared/constants/types"
import { CreditCard, Eye, OctagonAlert, Plus } from "lucide-react"
import Link from "next/link"
import MaskText from "../mask"
import { formatCurrency } from "@/shared/lib/format-currency"
import { useUserContext } from "@/context/user.provider"
import Show from "../show"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import IconContainer from "../icon-container"
import { DebtModal } from "../debtmodal"
import { formatDistanceToNow } from "date-fns"
import { imageUrls } from "@/shared/constants/global-constants"
import Summarizer, { EntityType } from "../entity-summarizer"
import { Button } from "../ui/button"

export function AddDebtCard() {
  return (
    <Link href={`/products/debttrack/createdebt`}>
      <Card className="w-full max-w-sm h-[22rem] flex items-center justify-center bg-background border border-border text-white hover:shadow-md hover:shadow-primary/20 duration-400">
        <Plus className="w-20 h-20 text-primary" />
      </Card>
    </Link>
  )
}

export function DebtCard({ debt }: { debt: Debt }) {
  const [{ user }] = useUserContext()

  const formattedDate = debt.createdAt
    ? formatDistanceToNow(new Date(debt.createdAt), { addSuffix: true })
    : null

  return (
    <Card className="w-full max-w-xs mx-auto h-[22rem] flex flex-col relative hover:shadow-md transition-shadow bg-background border-border text-white">
      <div className="relative aspect-video overflow-hidden bg-muted rounded-t-3xl">
        <img
          src={imageUrls.debt}
          alt={debt.debtPurpose}
          className="object-cover w-full h-full transition-transform duration-300 rounded-t-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60" />
        <Badge className="absolute top-2 left-2 bg-primary/90 hover:bg-primary text-black">
          DEBT
        </Badge>
        <div className="absolute top-2 right-2">
          <IconContainer>
            <CreditCard className="h-4 w-4" />
          </IconContainer>
        </div>
      </div>
      <CardHeader className="flex-grow">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold truncate text-white">
            {debt.debtPurpose}
          </CardTitle>
          <div className="flex items-center justify-between">
            <Show condition={debt.isMatured}>
              <Tooltip>
                <TooltipTrigger>
                  <OctagonAlert className="h-4 w-4 text-secondary" />
                </TooltipTrigger>
                <TooltipContent className="bg-background text-white border-border">
                  This debt is closed
                </TooltipContent>
              </Tooltip>
            </Show>
            <Show condition={debt.isMaturityApproaching}>
              <Tooltip>
                <TooltipTrigger>
                  <OctagonAlert className="h-4 w-4 text-amber-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-background text-white border-border">
                  This debt is about to end
                </TooltipContent>
              </Tooltip>
            </Show>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-300">Identifier</span>
            <span className="text-sm font-medium">
              <MaskText value={debt.identifier} />
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-300">EMI</span>
            <span className="text-lg font-bold text-white">
              {formatCurrency(debt?.emi ?? 0, user.baseCurrency)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {formattedDate && <span>{formattedDate}</span>}
            </div>
            <Summarizer entityType={EntityType.DEBT} entityId={debt._id} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <DebtModal debtDetails={debt} key={debt._id}>
          <Button
            variant="default"
            className="w-full gap-2 bg-border hover:bg-border"
          >
            View Details
            <Eye className="h-4 w-4" />
          </Button>
        </DebtModal>
      </CardFooter>
    </Card>
  )
}
