import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Asset, Debt, Goal } from "@/shared/constants/types"
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
import { formatDate } from "@/shared/lib/format-date"
import {
  amountKeys,
  deleteEntityAPIUriMap,
  editEntityUrlMap,
  EntityTypeForDetailModal,
  excludedKeys,
} from "./data"

type EntityDetailsProps = {
  entityType: EntityTypeForDetailModal
  entity: Asset | Debt | Goal
  children: ReactNode
}

enum DeleteQueryKey {
  ASSET = "get-assets",
  DEBT = "get-debts",
  GOAL = "get-goals",
}

export function EntityDetails({
  entityType,
  entity,
  children,
}: EntityDetailsProps) {
  const [{ user }] = useUserContext()
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { confirm } = useConfirmContext()
  const [entityBadgeText, setEnytityBadgeText] = useState("")
  const [displayName, setDisplayName] = useState("")

  useEffect(() => {
    switch (entityType) {
      case EntityTypeForDetailModal.ASSET:
        setEnytityBadgeText((entity as Asset).assetType.replace("_", " "))
        setDisplayName((entity as Asset).assetName)
        break
      case EntityTypeForDetailModal.DEBT:
        setEnytityBadgeText("DEBT")
        setDisplayName((entity as Debt).debtPurpose)
        break
      case EntityTypeForDetailModal.GOAL:
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
          `${deleteEntityAPIUriMap[entityType as keyof typeof deleteEntityAPIUriMap]}/${(entity as Asset | Debt | Goal)._id}`
        )
        queryClient.refetchQueries({
          queryKey: [
            `${DeleteQueryKey[entityType.toUpperCase() as keyof typeof DeleteQueryKey]}`,
          ],
        })
        notify(`${uiConstants.entityDeleted} ${entityType}`, "success")
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
      <DialogContent className="max-w-[25rem] bg-background border-border outline-none text-white -mb-4">
        <DialogHeader>
          <div className="flex justify-between">
            <div>
              <DialogTitle>{displayName}</DialogTitle>
              <Badge
                variant="default"
                className="w-fit bg-primary hover:bg-primary text-black mt-2"
              >
                {entityBadgeText}
              </Badge>
              <DialogDescription></DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={(): void =>
                  router.push(
                    `${editEntityUrlMap[entityType as keyof typeof editEntityUrlMap]}/${(entity as Asset | Debt | Goal)._id}`
                  )
                }
                variant="default"
                size="icon"
                className="p-2 bg-primary hover:bg-primary"
              >
                <Pen className="text-black h-4 w-4" />
              </Button>
              <Button onClick={deleteEntity} variant="secondary" size="icon">
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
          <Button variant="outline" onClick={(): void => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
