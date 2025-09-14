import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Debt } from "@/shared/constants/types"
import { CreditCard, OctagonAlert, Plus } from "lucide-react"
import Link from "next/link"
import MaskText from "../mask"
import { formatCurrency } from "@/shared/lib/format-currency"
import { useUserContext } from "@/context/user.provider"
import Show from "../show"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import IconContainer from "../icon-container"
import { DebtModal } from "../debtmodal"

export function DebtCard({ debt }: { debt: Debt }) {
  const [{ user }] = useUserContext()

  return (
    <DebtModal debtDetails={debt} key={debt._id}>
      <Card className="w-full max-w-sm bg-background border border-border text-white cursor-pointer hover:shadow-md hover:shadow-primary/20 duration-400">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold truncate text-white">
              {debt.debtPurpose}
            </CardTitle>
            <IconContainer>
              <CreditCard className="h-4 w-4" />
            </IconContainer>
          </div>
          <div className="flex items-center justify-between">
            <Badge
              variant="default"
              className="w-fit bg-neutral-800 hover:bg-neutral-800 text-primary -ms-1"
            >
              DEBT
            </Badge>
            <Show condition={debt.isLoanExpired}>
              <Tooltip>
                <TooltipTrigger>
                  <OctagonAlert className="h-4 w-4 text-secondary" />
                </TooltipTrigger>
                <TooltipContent className="bg-background text-white border-border">
                  This debt is closed
                </TooltipContent>
              </Tooltip>
            </Show>
            <Show condition={debt.isLoanAboutToEnd}>
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
        </CardHeader>

        <CardContent className="space-y-4">
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
          </div>
        </CardContent>
      </Card>
    </DebtModal>
  )
}

export function AddDebtCard() {
  return (
    <Link href={`/products/debttrack/createdebt`}>
      <Card className="w-full max-w-sm h-[180px] flex items-center justify-center bg-background border border-border text-white hover:shadow-md hover:shadow-primary/20 duration-400">
        <Plus className="w-20 h-20 text-primary" />
      </Card>
    </Link>
  )
}
