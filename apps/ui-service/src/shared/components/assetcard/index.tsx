import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Asset, Currency, Valuation } from "@/shared/types"
import { Coins, Plus } from "lucide-react"
import Link from "next/link"
import MaskText from "../mask"
import useQuery from "@/shared/hooks/use-query"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"

function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function AssetCard({
  asset,
  baseCurrency,
}: {
  asset: Asset
  baseCurrency: Currency
}) {
  const { data } = useQuery<Valuation>({
    queryKey: ["get-asset-valuation", asset._id],
    queryUrl: `${endPoints.getAssetValuation}/${asset._id}`,
    method: HTTPMethods.GET,
  })

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-200 bg-main border-background text-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold truncate text-white">
            {asset.assetName}
          </CardTitle>
          <Coins className="text-primary w-6 h-6" />
        </div>
        <Badge variant="secondary" className="w-fit">
          {asset.assetType}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Identifier</span>
            <span className="text-sm font-medium">
              <MaskText value={asset.identifier} />
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Current Valuation</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(data?.presentValuation ?? 0, baseCurrency)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AddAssetCard() {
  return (
    <Link href={`/create/asset`}>
      <Card className="w-full max-w-sm h-[174px] flex items-center justify-center hover:shadow-lg transition-shadow duration-200 bg-main border-background text-white">
        <Plus className="w-20 h-20 text-primary" />
      </Card>
    </Link>
  )
}
