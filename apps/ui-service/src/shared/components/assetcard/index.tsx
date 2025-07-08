import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Brain } from "lucide-react"
import { Badge } from "../ui/badge"
import { formatKey, formatValue } from "@/shared/lib/format-key-value"
import { Asset } from "@/shared/types"

interface AssetCardProps {
  asset: Asset
}

const excludedKeys = [
  "_id",
  "userId",
  "portfolioId",
  "createdAt",
  "updatedAt",
  "assetName",
  "assetType",
]

export function AssetCard({ asset }: AssetCardProps) {
  const { _id, assetName, assetType } = asset

  return (
    <Card className="w-full max-w-xs mx-auto h-[23rem] flex flex-col relative hover:shadow-md transition-shadow bg-background border-border text-white">
      <CardHeader className="pb-2">
        <div className="flex items-start">
          <Brain className="w-8 h-8 text-primary mr-3 mt-1 text-primary" />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-2">
              <CardTitle
                className="text-lg font-bold truncate"
                title={assetName}
              >
                {assetName}
              </CardTitle>
              <Badge variant="secondary" className="text-xs" title={assetType}>
                {assetType}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow py-2">
        <dl className="grid gap-3">
          {Object.entries(asset ?? {})
            .filter(([key]) => !excludedKeys.includes(key))
            .splice(0, 5)
            .map(([key, value]) => (
              <div key={key} className="space-y-1">
                <dt className="text-xs font-medium text-zinc-300">
                  {formatKey(key)}
                </dt>
                <dd className="text-sm font-semibold">{formatValue(value)}</dd>
              </div>
            ))}
        </dl>
      </CardContent>
    </Card>
  )
}
