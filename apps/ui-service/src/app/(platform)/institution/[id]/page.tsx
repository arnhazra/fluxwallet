"use client"
import useQuery from "@/shared/hooks/use-query"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import { use } from "react"
import { Asset, Institution } from "@/shared/types"
import { AddAssetCard, AssetCard } from "@/shared/components/assetcard"
import SectionPanel from "@/shared/components/sectionpanel"
import { Building, Pen, Trash } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useRouter } from "next/navigation"
import { useConfirmContext } from "@/shared/providers/confirm.provider"
import ky from "ky"
import { uiConstants } from "@/shared/constants/global-constants"
import notify from "@/shared/hooks/use-notify"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: institutionId = "" } = use(params)
  const router = useRouter()
  const { confirm } = useConfirmContext()

  const institution = useQuery<Institution>({
    queryKey: ["get-institution", institutionId],
    queryUrl: `${endPoints.institution}/${institutionId}`,
    method: HTTPMethods.GET,
  })

  const assets = useQuery<Asset[]>({
    queryKey: ["get-assets", institutionId],
    queryUrl: `${endPoints.asset}/institution/${institutionId}`,
    method: HTTPMethods.GET,
  })

  const renderAssets = assets?.data?.map((asset) => {
    return <AssetCard asset={asset} key={asset._id} />
  })

  const handleDeleteInstitution = async () => {
    if (assets.data?.length) {
      notify(uiConstants.institutionDeleteWarning, "warning")
      return
    }
    const confirmed = await confirm({
      title: "Delete Institution",
      desc: "Are you sure you want to delete this institution?",
    })

    if (confirmed) {
      try {
        await ky.delete(`${endPoints.institution}/${institutionId}`)
        router.push("/dashboard")
      } catch (error) {
        notify(uiConstants.institutionDeleteFailed, "error")
      }
    }
  }

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <section>
        <SectionPanel
          icon={<Building className="h-4 w-4 text-primary" />}
          title={institution.data?.institutionName || ""}
          content={institution.data?.institutionType || ""}
          actionComponents={[
            <Button
              onClick={(): void =>
                router.push(`/edit/institution/${institutionId}`)
              }
              variant="default"
              size="icon"
              className="p-2 bg-green-500/20 hover:bg-green-500/20 rounded-lg"
            >
              <Pen className="text-green-400 h-4 w-4" />
            </Button>,
            <Button
              onClick={handleDeleteInstitution}
              variant="destructive"
              size="icon"
            >
              <Trash className="h-4 w-4" />
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
