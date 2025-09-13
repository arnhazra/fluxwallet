import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Asset } from "@/shared/constants/types"
import { Banknote, OctagonAlert, Plus } from "lucide-react"
import Link from "next/link"
import MaskText from "../mask"
import { formatCurrency } from "@/shared/lib/format-currency"
import { useUserContext } from "@/context/user.provider"
import { AssetModal } from "../assetmodal"
import Show from "../show"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import IconContainer from "../icon-container"

export function AssetCard({ asset }: { asset: Asset }) {
  const [{ user }] = useUserContext()

  const isAssetMatured = (): boolean => {
    return !!asset.maturityDate && new Date() >= new Date(asset.maturityDate)
  }

  const isAssetAboutToMature = (): boolean => {
    if (!asset.maturityDate || isAssetMatured()) {
      return false
    }

    const now = new Date()
    const maturity = new Date(asset.maturityDate)

    const thirtyDaysLater = new Date()
    thirtyDaysLater.setDate(now.getDate() + 30)

    return maturity <= thirtyDaysLater
  }

  return (
    <AssetModal assetDetails={asset} key={asset._id}>
      <Card className="w-full max-w-sm bg-background border border-border text-white cursor-pointer hover:shadow-md hover:shadow-primary/20 duration-400">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold truncate text-white">
              {asset.assetName}
            </CardTitle>
            <IconContainer>
              <Banknote className="h-4 w-4" />
            </IconContainer>
          </div>
          <div className="flex items-center justify-between">
            <Badge
              variant="default"
              className="w-fit bg-neutral-800 hover:bg-neutral-800 text-primary -ms-1"
            >
              {asset.assetType.replace("_", " ")}
            </Badge>
            <Show condition={isAssetMatured()}>
              <Tooltip>
                <TooltipTrigger>
                  <OctagonAlert className="h-4 w-4 text-secondary" />
                </TooltipTrigger>
                <TooltipContent className="bg-background text-white border-border">
                  This asset is matured
                </TooltipContent>
              </Tooltip>
            </Show>
            <Show condition={isAssetAboutToMature()}>
              <Tooltip>
                <TooltipTrigger>
                  <OctagonAlert className="h-4 w-4 text-amber-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-background text-white border-border">
                  This asset is about to mature
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
                <MaskText value={asset.identifier} />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-300">
                Present Valuation
              </span>
              <span className="text-lg font-bold text-white">
                {formatCurrency(
                  asset?.presentValuation ?? 0,
                  user.baseCurrency
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </AssetModal>
  )
}

export function AddAssetCard() {
  return (
    <Link href={`/products/wealthanalyzer/create/asset`}>
      <Card className="w-full max-w-sm h-[174px] flex items-center justify-center bg-background border border-border text-white hover:shadow-md hover:shadow-primary/20 duration-400">
        <Plus className="w-20 h-20 text-primary" />
      </Card>
    </Link>
  )
}
