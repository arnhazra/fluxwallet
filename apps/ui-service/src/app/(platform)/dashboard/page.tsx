"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { useEffect, useState } from "react"
import { Asset, Portfolio } from "@/shared/types"
import SectionPanel from "@/shared/components/sectionpanel"
import { Building, Edit, Filter, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Button } from "@/shared/components/ui/button"
import Show from "@/shared/components/show"
import { AssetCard } from "@/shared/components/assetcard"

export default function Page() {
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  )

  const portfolios = useQuery<Portfolio[]>({
    queryKey: ["get-portfolios"],
    queryUrl: endPoints.portfolio,
    method: HTTPMethods.GET,
  })

  const assets = useQuery<Asset[]>({
    queryKey: ["get-assets", selectedPortfolio?._id ?? ""],
    queryUrl: `${endPoints.asset}/portfolio/${selectedPortfolio?._id ?? ""}`,
    method: HTTPMethods.GET,
    suspense: false,
    enabled: !!selectedPortfolio?._id,
  })

  useEffect(() => {
    if (portfolios?.data && portfolios.data.length > 0) {
      setSelectedPortfolio(portfolios.data[0])
    }
  }, [portfolios?.data])

  const renderPortfolios = portfolios?.data?.map((portfolio) => {
    return (
      <DropdownMenuCheckboxItem
        key={portfolio._id}
        checked={selectedPortfolio?._id === portfolio._id}
        onClick={(): void => setSelectedPortfolio(portfolio)}
      >
        {portfolio.portfolioName}
      </DropdownMenuCheckboxItem>
    )
  })

  const renderAssets = assets?.data?.map((asset) => {
    return <AssetCard asset={asset} key={asset._id} />
  })

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <section>
        <div className="flex mb-4">
          <div className="ml-auto flex items-center gap-4">
            <Show
              condition={
                (portfolios?.data && portfolios.data.length > 0) ?? false
              }
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    size="default"
                    className="h-10 gap-1 bg-border hover:bg-border"
                  >
                    <Filter className="h-3.5 w-3.5" />
                    <span>Portfolio</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-background border-border text-white"
                >
                  <DropdownMenuLabel>Select Portfolio</DropdownMenuLabel>
                  {renderPortfolios}
                </DropdownMenuContent>
              </DropdownMenu>
            </Show>
            <Button variant="default" className="bg-primary hover:bg-primary">
              Create
            </Button>
          </div>
        </div>
        <SectionPanel
          icon={<Building className="scale-75" />}
          title={selectedPortfolio?.portfolioName ?? ""}
          content={`${selectedPortfolio?.institutionType} (${selectedPortfolio?.baseCurrency})`}
          actionComponents={[
            <Button size="icon" variant="secondary" key="edit">
              <Edit className="scale-50" />
            </Button>,
            <Button size="icon" variant="destructive">
              <Trash className="scale-50" />
            </Button>,
          ]}
        />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4 py-4">
          {renderAssets}
        </div>
      </section>
    </div>
  )
}
