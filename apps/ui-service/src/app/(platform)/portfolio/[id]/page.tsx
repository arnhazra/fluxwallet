"use client"
import useQuery from "@/shared/hooks/use-query"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import { use } from "react"
import { Asset, Currency, Portfolio } from "@/shared/types"
import { AddAssetCard, AssetCard } from "@/shared/components/assetcard"
import SectionPanel from "@/shared/components/sectionpanel"
import { Building, Pen, Trash } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useRouter } from "next/navigation"
import { useConfirmContext } from "@/shared/providers/confirm.provider"
import ky from "ky"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: portfolioId = "" } = use(params)
  const router = useRouter()
  const { confirm } = useConfirmContext()

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
    return (
      <AssetCard
        asset={asset}
        key={asset._id}
        baseCurrency={portfolio.data?.baseCurrency ?? Currency.INR}
      />
    )
  })

  const handleDeletePortfolio = async () => {
    const confirmed = await confirm({
      title: "Delete Portfolio",
      desc: "Are you sure you want to delete this portfolio?",
    })

    if (confirmed) {
      try {
        await ky.delete(`${endPoints.portfolio}/${portfolioId}`)
        router.push("/dashboard")
      } catch (error) {
        console.error("Failed to delete portfolio:", error)
        // Optionally, you can show an error message to the user
      }
    }
  }

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <section>
        <SectionPanel
          icon={<Building className="scale-75 text-primary" />}
          title={portfolio.data?.portfolioName || ""}
          content={portfolio.data?.institutionType || ""}
          actionComponents={[
            <Button
              onClick={(): void =>
                router.push(`/portfolio/edit/${portfolioId}`)
              }
              variant="default"
              className="bg-border text-white"
            >
              <Pen className="scale-50" />
            </Button>,
            <Button onClick={handleDeletePortfolio} variant="destructive">
              <Trash className="scale-50" />
            </Button>,
          ]}
        />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4 py-4">
          <AddAssetCard />
          {renderAssets}
        </div>
      </section>
    </div>
  )
}
