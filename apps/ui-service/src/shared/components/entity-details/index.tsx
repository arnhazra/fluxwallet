import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Asset, Debt, Goal, Institution } from "@/shared/constants/types"
import { endPoints } from "@/shared/constants/api-endpoints"
import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog"
import { ReactNode, useEffect, useState } from "react"
import { Badge } from "../ui/badge"
import { formatKey, formatValue } from "@/shared/lib/format-key-value"
import { Pen, Trash } from "lucide-react"
import ky from "ky"
import notify from "@/shared/hooks/use-notify"
import { uiConstants } from "@/shared/constants/global-constants"
import { useConfirmContext } from "@/shared/providers/confirm.provider"
import { useRouter } from "nextjs-toploader/app"
import { Button } from "../ui/button"
import { useUserContext } from "@/context/user.provider"
import { useQueryClient } from "@tanstack/react-query"
import { EntityMap, EntityType } from "../entity-card"
import { formatDate } from "@/shared/lib/format-date"

const excludedKeys = [
  "_id",
  "userId",
  "institutionId",
  "assetType",
  "assetName",
  "createdAt",
  "isMaturityApproaching",
  "isMatured",
  "debtPurpose",
]

const amountKeys = [
  "amountInvested",
  "contributionAmount",
  "currentValuation",
  "presentValuation",
  "unitPurchasePrice",
  "valuationOnPurchase",
  "goalAmount",
  "principalAmount",
  "totalRepayment",
  "totalInterest",
  "emi",
  "remainingPrincipal",
  "remainingTotal",
]

const editEntityUrlMap = {
  asset: "/products/wealthanalyzer/edit/asset",
  debt: "/products/debttrack/editdebt",
  goal: "/products/wealthgoal/editgoal",
}

const deleteEntityUrlMap = {
  asset: endPoints.asset,
  debt: endPoints.debt,
  goal: endPoints.goal,
}

type EntityDetailsProps<T extends keyof EntityMap> = {
  entityType: T
  entity: EntityMap[T]
  children: ReactNode
}

export function EntityDetails<T extends keyof EntityMap>({
  entityType,
  entity,
  children,
}: EntityDetailsProps<T>) {
  console.log({ entity, entityType })
  const [{ user }] = useUserContext()
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { confirm } = useConfirmContext()
  const [entityBadgeText, setEnytityBadgeText] = useState("")
  const [displayName, setDisplayName] = useState("")

  useEffect(() => {
    switch (entityType) {
      case EntityType.ASSET:
        setEnytityBadgeText((entity as Asset).assetType.replace("_", " "))
        setDisplayName((entity as Asset).assetName)
        break
      case EntityType.DEBT:
        setEnytityBadgeText("DEBT")
        setDisplayName((entity as Debt).debtPurpose)
        break
      case EntityType.GOAL:
        setEnytityBadgeText("GOAL")
        setDisplayName(formatDate((entity as Goal).goalDate))
        break
      default:
        break
    }
  }, [entityType, entity])

  const deleteEntity = async (): Promise<void> => {
    setOpen(false)
    const confirmed = await confirm({
      title: `Delete ${entityType}`,
      desc: `Are you sure you want to delete this ${entityType}?`,
    })

    if (confirmed) {
      try {
        await ky.delete(
          `${deleteEntityUrlMap[entityType as keyof typeof deleteEntityUrlMap]}/${entity._id}`
        )
        queryClient.refetchQueries({ queryKey: ["get-assets"] })
        notify(uiConstants.assetDeleted, "success")
      } catch (error) {
        notify(uiConstants.genericError, "error")
      }
    }
  }

  const isAmount = (key: keyof Asset): boolean => amountKeys.includes(key)

  return (
    <Dialog open={open}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[25rem] bg-background border-border outline-none text-white -mb-4 asset-modal">
        <DialogHeader>
          <div className="flex justify-between">
            <div>
              <DialogTitle>{displayName}</DialogTitle>
              <Badge
                variant="default"
                className="w-fit bg-neutral-800 hover:bg-neutral-800 text-primary mt-2"
              >
                {entityBadgeText}
              </Badge>
              <DialogDescription></DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={(): void =>
                  router.push(
                    `${editEntityUrlMap[entityType as keyof typeof editEntityUrlMap]}/${entity._id}`
                  )
                }
                variant="default"
                size="icon"
                className="p-2 bg-primary hover:bg-primary"
              >
                <Pen className="text-black h-4 w-4" />
              </Button>
              <Button onClick={deleteEntity} variant="destructive" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="grid gap-6">
          <ul className="grid gap-3 text-sm text-muted-foreground">
            {Object.entries(entity ?? {})
              .filter(([key]) => !excludedKeys.includes(key))
              .map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <strong>{formatKey(key)}</strong>{" "}
                  {formatValue(
                    value,
                    key.includes("Date"),
                    isAmount(key as keyof Asset),
                    user.baseCurrency,
                    key.includes("Rate")
                  )}
                </div>
              ))}
          </ul>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={(): void => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
