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
  const assetDetails = useQuery<Asset>({
    queryKey: ["pricing-settings", assetId],
    queryUrl: `${endPoints.asset}/${assetId}`,
    method: HTTPMethods.GET,
    suspense: false,
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[25rem] bg-background border-lightborder outline-none text-white -mb-4 asset-modal">
        <DialogHeader>
          <DialogTitle>{assetDetails.data?.assetName}</DialogTitle>
          <Badge variant="default" className="w-fit bg-border text-primary">
            {assetDetails.data?.assetType}
          </Badge>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <ul className="grid gap-3 text-sm text-muted-foreground">
            {Object.entries(assetDetails.data ?? {})
              .filter(([key]) => !excludedKeys.includes(key))
              .map(([key, value]) => (
                <div key={key}>
                  <strong>{formatKey(key)}:</strong> {formatValue(value)}
                </div>
              ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
