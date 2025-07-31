import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import useQuery from "@/shared/hooks/use-query"
import { Asset } from "@/shared/types"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog"
import { ReactNode, useState } from "react"
import { Badge } from "../ui/badge"
import { formatKey, formatValue } from "@/shared/lib/format-key-value"
import { TrashIcon } from "lucide-react"
import ky from "ky"
import notify from "@/shared/hooks/use-notify"
import { uiConstants } from "@/shared/constants/global-constants"
import { useConfirmContext } from "@/shared/providers/confirm.provider"

interface AssetModalProps {
  assetId: string
  children: ReactNode
}

const excludedKeys = [
  "_id",
  "userId",
  "portfolioId",
  "assetType",
  "assetName",
  "createdAt",
]

export function AssetModal({ assetId, children }: AssetModalProps) {
  const [open, setOpen] = useState(false)
  const { confirm } = useConfirmContext()
  const assetDetails = useQuery<Asset>({
    queryKey: ["asset-details", assetId],
    queryUrl: `${endPoints.asset}/${assetId}`,
    method: HTTPMethods.GET,
    suspense: false,
    enabled: open,
  })

  const deleteAsset = async (): Promise<void> => {
    const confirmed = await confirm({
      title: "Delete Asset",
      desc: "Are you sure you want to delete this asset?",
    })

    if (confirmed) {
      try {
        await ky.delete(`${endPoints.asset}/${assetId}`)
        notify(uiConstants.assetDeleted, "success")
      } catch (error) {
        notify(uiConstants.genericError, "error")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[25rem] bg-background border-lightborder outline-none text-white -mb-4 asset-modal">
        <DialogHeader>
          <div className="flex justify-between">
            <div>
              <DialogTitle>{assetDetails.data?.assetName}</DialogTitle>
              <Badge
                variant="default"
                className="w-fit bg-border text-primary mt-2"
              >
                {assetDetails.data?.assetType}
              </Badge>
              <DialogDescription></DialogDescription>
            </div>
            <TrashIcon
              onClick={deleteAsset}
              className="h-5 w-5 text-secondary cursor-pointer"
            />
          </div>
        </DialogHeader>
        <div className="grid gap-6">
          <ul className="grid gap-3 text-sm text-muted-foreground">
            {Object.entries(assetDetails.data ?? {})
              .filter(([key]) => !excludedKeys.includes(key))
              .map(([key, value]) => (
                <div key={key}>
                  <strong>{formatKey(key)}:</strong>{" "}
                  {formatValue(value, key.includes("Date"))}
                </div>
              ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
