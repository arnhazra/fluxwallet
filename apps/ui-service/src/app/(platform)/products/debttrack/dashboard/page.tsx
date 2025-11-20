"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Debt } from "@/shared/constants/types"
import { AddEntityCard, EntityCard } from "@/shared/components/entity-card"
import { EntityType } from "@/shared/components/entity-card/data"
import StatCardStack from "@/shared/components/stat-card/stat-card-stack"
import { useUserContext } from "@/context/user.provider"
import { buildQueryUrl } from "@/shared/lib/build-url"

export default function Page() {
  const [{ searchKeyword }] = useUserContext()
  const debts = useQuery<Debt[]>({
    queryKey: ["get-debts", searchKeyword],
    queryUrl: buildQueryUrl(endPoints.debt, {
      searchKeyword: encodeURIComponent(searchKeyword),
    }),
    method: HTTPMethods.GET,
    suspense: !!searchKeyword ? false : true,
  })

  const renderDebts = debts?.data?.map((debt) => (
    <EntityCard entityType={EntityType.DEBT} entity={debt} key={debt._id} />
  ))

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <StatCardStack />
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
          <AddEntityCard entityType={EntityType.DEBT} />
          {renderDebts}
        </div>
      </section>
    </div>
  )
}
