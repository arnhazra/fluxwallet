"use client"
import useQuery from "@/shared/hooks/use-query"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import { use } from "react"
import { Asset, Space } from "@/shared/constants/types"
import SectionPanel from "@/shared/components/section-panel"
import { Layers2, Pen, Trash } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useRouter } from "nextjs-toploader/app"
import { useConfirmContext } from "@/shared/providers/confirm.provider"
import { uiConstants } from "@/shared/constants/global-constants"
import notify from "@/shared/hooks/use-notify"
import IconContainer from "@/shared/components/icon-container"
import { AddEntityCard, EntityCard } from "@/shared/components/entity-card"
import { EntityType } from "@/shared/components/entity-card/data"
import { useUserContext } from "@/context/user.provider"
import { buildQueryUrl } from "@/shared/lib/build-url"
import api from "@/shared/lib/ky-api"
import Link from "next/link"

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
    suspense: !!searchKeyword ? false : true,
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
        await api.delete(`${endPoints.space}/${spaceId}`)
        router.push("/apps/wealthanalyzer")
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
              <Layers2 className="h-4 w-4" />
            </IconContainer>
          }
          title={space.data?.spaceName || ""}
          content="SPACE"
          actionComponents={[
            <Link href={`/apps/wealthanalyzer/createoreditspace?id=${spaceId}`}>
              <Button
                variant="default"
                size="icon"
                className="p-2 bg-primary hover:bg-primary text-black"
              >
                <Pen className="h-4 w-4" />
              </Button>
            </Link>,
            <Button onClick={handleDeleteSpace} variant="secondary" size="icon">
              <Trash className="h-4 w-4" />
            </Button>,
          ]}
        />
        <div className="mx-auto grid justify-center gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-4 mt-4">
          <AddEntityCard entityType={EntityType.ASSET} />
          {renderAssets}
        </div>
      </section>
    </div>
  )
}
