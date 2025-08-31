import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Asset } from "@/shared/types"
import { endPoints } from "@/shared/constants/api-endpoints"
import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog"
import { ReactNode, useState } from "react"
import { Badge } from "../ui/badge"
import { formatKey, formatValue } from "@/shared/lib/format-key-value"
import { Pen, Trash } from "lucide-react"
import ky from "ky"
import notify from "@/shared/hooks/use-notify"
import { uiConstants } from "@/shared/constants/global-constants"
import { useConfirmContext } from "@/shared/providers/confirm.provider"
import { useRouter } from "nextjs-toploader/app"
import { Button } from "../ui/button"
import { useAppContext } from "@/context/appstate.provider"
import Summarizer from "../summarizer"

interface AssetModalProps {
  assetDetails: Asset
  children: ReactNode
}

const excludedKeys = [
  "_id",
  "userId",
  "institutionId",
  "assetType",
  "assetName",
  "createdAt",
]

export function AssetModal({ assetDetails, children }: AssetModalProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [{ user }] = useAppContext()
  const { confirm } = useConfirmContext()

  const deleteAsset = async (): Promise<void> => {
    setOpen(false)
    const confirmed = await confirm({
      title: "Delete Asset",
      desc: "Are you sure you want to delete this asset?",
    })

    if (confirmed) {
      try {
        await ky.delete(`${endPoints.asset}/${assetDetails._id}`)
        notify(uiConstants.assetDeleted, "success")
      } catch (error) {
        notify(uiConstants.genericError, "error")
      }
    }
  }

  const amountKeys = new Set<keyof Asset>([
    "amountInvested",
    "contributionAmount",
    "currentValuation",
    "presentValuation",
    "unitPurchasePrice",
    "valuationOnPurchase",
  ])

  const isAmount = (key: keyof Asset): boolean => amountKeys.has(key)

  return (
    <Dialog open={open}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[25rem] bg-background border-border outline-none text-white -mb-4 asset-modal">
        <DialogHeader>
          <div className="flex justify-between">
            <div>
              <DialogTitle>{assetDetails?.assetName}</DialogTitle>
              <Badge
                variant="default"
                className="w-fit bg-neutral-800 hover:bg-neutral-800 text-primary mt-2"
              >
                {assetDetails?.assetType}
              </Badge>
              <DialogDescription></DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={(): void =>
                  router.push(
                    `/products/wealthanalyzer/edit/asset/${assetDetails._id}`
                  )
                }
                variant="default"
                size="icon"
                className="p-2 bg-primary hover:bg-primary"
              >
                <Pen className="text-black h-4 w-4" />
              </Button>
              <Button onClick={deleteAsset} variant="destructive" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="grid gap-6">
          <ul className="grid gap-3 text-sm text-muted-foreground">
            {Object.entries(assetDetails ?? {})
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
          <Summarizer entityType="asset" entityId={assetDetails._id} />
          <Button
            variant="secondary"
            size="sm"
            onClick={(): void => setOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
