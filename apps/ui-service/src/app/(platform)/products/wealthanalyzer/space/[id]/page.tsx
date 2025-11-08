"use client"
import useQuery from "@/shared/hooks/use-query"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import { use } from "react"
import { Asset, Space } from "@/shared/constants/types"
import SectionPanel from "@/shared/components/section-panel"
import { Building, Pen, Trash } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useRouter } from "nextjs-toploader/app"
import { useConfirmContext } from "@/shared/providers/confirm.provider"
import ky from "ky"
import { uiConstants } from "@/shared/constants/global-constants"
import notify from "@/shared/hooks/use-notify"
import IconContainer from "@/shared/components/icon-container"
import { AddEntityCard, EntityCard } from "@/shared/components/entity-card"
import { EntityType } from "@/shared/components/entity-card/data"
import { useUserContext } from "@/context/user.provider"
import { buildQueryUrl } from "@/shared/lib/build-url"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: spaceId = "" } = use(params)
  const router = useRouter()
  const [{ searchKeyword }] = useUserContext()
  const { confirm } = useConfirmContext()

  const space = useQuery<Space>({
    queryKey: ["get-space", spaceId],
    queryUrl: `${endPoints.space}/${spaceId}`,
    method: HTTPMethods.GET,
  })

  const assets = useQuery<Asset[]>({
    queryKey: ["get-assets", spaceId, searchKeyword],
    queryUrl: buildQueryUrl(`${endPoints.asset}/space/${spaceId}`, {
      searchKeyword: encodeURIComponent(searchKeyword),
    }),
    method: HTTPMethods.GET,
    suspense: !!searchKeyword.length ? false : true,
  })

  const renderAssets = assets?.data?.map((asset) => {
    return (
      <EntityCard
        entityType={EntityType.ASSET}
        entity={asset}
        key={asset._id}
      />
    )
  })

  const handleDeleteSpace = async () => {
    if (assets.data?.length) {
      notify(uiConstants.spaceDeleteWarning, "warning")
      return
    }
    const confirmed = await confirm({
      title: "Delete Space",
      desc: "Are you sure you want to delete this space?",
    })

    if (confirmed) {
      try {
        await ky.delete(`${endPoints.space}/${spaceId}`)
        router.push("/products/wealthanalyzer/dashboard")
      } catch (error) {
        notify(uiConstants.spaceDeleteFailed, "error")
      }
    }
  }

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <section>
        <SectionPanel
          icon={
            <IconContainer>
              <Building className="h-4 w-4" />
            </IconContainer>
          }
          title={space.data?.spaceName || ""}
          content="SPACE"
          actionComponents={[
            <Button
              onClick={(): void =>
                router.push(`/products/wealthanalyzer/edit/space/${spaceId}`)
              }
              variant="default"
              size="icon"
              className="p-2 bg-primary hover:bg-primary text-black"
            >
              <Pen className="h-4 w-4" />
            </Button>,
            <Button
              onClick={handleDeleteSpace}
              variant="destructive"
              size="icon"
            >
              <Trash className="h-4 w-4" />
            </Button>,
          ]}
        />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4 py-4">
          <AddEntityCard entityType={EntityType.ASSET} />
          {renderAssets}
        </div>
      </section>
    </div>
  )
}
