"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Space } from "@/shared/constants/types"
import { AddEntityCard, EntityCard } from "@/shared/components/entity-card"
import { EntityType } from "@/shared/components/entity-card/data"
import StatCardStack from "@/shared/components/stat-card/stat-card-stack"
import { useUserContext } from "@/context/user.provider"

export default function Page() {
  const [{ searchKeyword }] = useUserContext()
  const spaces = useQuery<Space[]>({
    queryKey: ["get-spaces", searchKeyword],
    queryUrl: `${endPoints.space}?searchKeyword=${encodeURIComponent(
      searchKeyword
    )}`,
    method: HTTPMethods.GET,
    suspense: !!searchKeyword.length ? false : true,
  })

  const renderSpaces = spaces?.data?.map((space) => (
    <EntityCard entityType={EntityType.SPACE} entity={space} key={space._id} />
  ))

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <StatCardStack />
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4 pb-4">
          <AddEntityCard entityType={EntityType.SPACE} />
          {renderSpaces}
        </div>
      </section>
    </div>
  )
}
