import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Asset } from "@/shared/constants/types"
import { Banknote, Eye, OctagonAlert, Plus } from "lucide-react"
import Link from "next/link"
import MaskText from "../mask"
import { formatCurrency } from "@/shared/lib/format-currency"
import { useUserContext } from "@/context/user.provider"
import { AssetModal } from "../assetmodal"
import Show from "../show"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import IconContainer from "../icon-container"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/shared/components/ui/button"
import { imageUrls } from "@/shared/constants/global-constants"
import Summarizer from "../summarizer/asset-summarizer"

export function AddAssetCard() {
  return (
    <Link href={`/products/wealthanalyzer/create/asset`}>
      <Card className="w-full max-w-sm h-[22rem] flex items-center justify-center bg-background border border-border text-white hover:shadow-md hover:shadow-primary/20 duration-400">
        <Plus className="w-20 h-20 text-primary" />
      </Card>
    </Link>
  )
}

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

  const formattedDate = asset.createdAt
    ? formatDistanceToNow(new Date(asset.createdAt), { addSuffix: true })
    : null

  return (
    <Card className="w-full max-w-xs mx-auto h-[22rem] flex flex-col relative hover:shadow-md transition-shadow bg-background border-border text-white">
      <div className="relative aspect-video overflow-hidden bg-muted rounded-t-3xl">
        <img
          src={imageUrls.asset}
          alt={asset.assetName}
          className="object-cover w-full h-full transition-transform duration-300 rounded-t-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60" />
        <Badge className="absolute top-2 left-2 bg-primary/90 hover:bg-primary text-black">
          {asset.assetType.replace("_", " ")}
        </Badge>
        <div className="absolute top-2 right-2">
          <IconContainer>
            <Banknote className="h-4 w-4" />
          </IconContainer>
        </div>
      </div>
      <CardHeader className="flex-grow">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold truncate text-white">
            {asset.assetName}
          </CardTitle>
          <div className="flex items-center justify-between">
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-300">Identifier</span>
            <span className="text-sm font-medium">
              <MaskText value={asset.identifier} />
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-300">Present Valuation</span>
            <span className="text-lg font-bold text-white">
              {formatCurrency(asset?.presentValuation ?? 0, user.baseCurrency)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {formattedDate && <span>{formattedDate}</span>}
            </div>
            <Summarizer entityType="asset" entityId={asset._id} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <AssetModal assetDetails={asset} key={asset._id}>
          <Button
            variant="default"
            className="w-full gap-2 bg-border hover:bg-border"
          >
            View Details
            <Eye className="h-4 w-4" />
          </Button>
        </AssetModal>
      </CardFooter>
    </Card>
  )
}
