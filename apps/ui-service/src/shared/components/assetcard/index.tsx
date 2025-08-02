import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Asset } from "@/shared/types"
import { Coins, Plus } from "lucide-react"
import Link from "next/link"
import MaskText from "../mask"
import { formatCurrency } from "@/shared/lib/format-currency"
import { useAppContext } from "@/context/appstate.provider"
import { AssetModal } from "../assetmodal"

export function AssetCard({ asset }: { asset: Asset }) {
  const [{ user }] = useAppContext()

  return (
    <AssetModal assetDetails={asset} key={asset._id}>
      <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-200 bg-background border-none text-white cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold truncate text-white">
              {asset.assetName}
            </CardTitle>
            <Coins className="text-primary w-6 h-6" />
          </div>
          <Badge variant="default" className="w-fit bg-border text-primary">
            {asset.assetType}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Identifier</span>
              <span className="text-sm font-medium">
                <MaskText value={asset.identifier} />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">
                Present Valuation
              </span>
              <span className="text-lg font-bold text-primary">
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
    <Link href={`/create/asset`}>
      <Card className="w-full max-w-sm h-[174px] flex items-center justify-center hover:shadow-lg transition-shadow duration-200 bg-background border-none text-white">
        <Plus className="w-20 h-20 text-primary" />
      </Card>
    </Link>
  )
}
