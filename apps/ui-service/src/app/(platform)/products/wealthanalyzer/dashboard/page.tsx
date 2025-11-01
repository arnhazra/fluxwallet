"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Institution } from "@/shared/constants/types"
import { AddEntityCard, EntityCard } from "@/shared/components/entity-card"
import { EntityType } from "@/shared/components/entity-card/data"
import StatCardStack from "@/shared/components/stat-card/stat-card-stack"
import { useUserContext } from "@/context/user.provider"

export default function Page() {
  const [{ searchKeyword }] = useUserContext()
  const institutions = useQuery<Institution[]>({
    queryKey: ["get-institutions", searchKeyword],
    queryUrl: `${endPoints.institution}?searchKeyword=${encodeURIComponent(
      searchKeyword
    )}`,
    method: HTTPMethods.GET,
    suspense: !!searchKeyword.length ? false : true,
  })

  const renderInstitutions = institutions?.data?.map((institution) => (
    <EntityCard
      entityType={EntityType.INSTITUTION}
      entity={institution}
      key={institution._id}
    />
  ))

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <StatCardStack />
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4 pb-4">
          <AddEntityCard entityType={EntityType.INSTITUTION} />
          {renderInstitutions}
        </div>
      </section>
    </div>
  )
}
