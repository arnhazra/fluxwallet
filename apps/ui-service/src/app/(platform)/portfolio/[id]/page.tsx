"use client"
import useQuery from "@/shared/hooks/use-query"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import { use } from "react"
import { Button } from "@/shared/components/ui/button"
import { Asset, Portfolio } from "@/shared/types"
import AssetCard from "@/shared/components/assetcard"
import SectionPanel from "@/shared/components/sectionpanel"
import { Building } from "lucide-react"
import CopyToClipboard from "@/shared/components/copy"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: portfolioId = "" } = use(params)

  const portfolio = useQuery<Portfolio>({
    queryKey: ["get-portfolio", portfolioId],
    queryUrl: `${endPoints.portfolio}/${portfolioId}`,
    method: HTTPMethods.GET,
  })

  const assets = useQuery<Asset[]>({
    queryKey: ["get-assets", portfolioId],
    queryUrl: `${endPoints.asset}/portfolio/${portfolioId}`,
    method: HTTPMethods.GET,
  })

  const renderAssets = assets?.data?.map((asset) => {
    return <AssetCard asset={asset} key={asset._id} />
  })

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <section>
        <SectionPanel
          icon={<Building className="scale-75 text-primary" />}
          title={portfolio.data?.portfolioName || ""}
          content={portfolio.data?.institutionType || ""}
          actionComponents={[<CopyToClipboard value={""} />]}
        />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4 py-4">
          {renderAssets}
        </div>
      </section>
    </div>
  )
}
