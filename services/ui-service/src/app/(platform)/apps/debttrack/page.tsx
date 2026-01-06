"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Debt } from "@/shared/constants/types"
import { AddEntityCard, EntityCard } from "@/shared/components/entity-card"
import { EntityType } from "@/shared/components/entity-card/data"
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
    <section>
      <div className="mx-auto grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-4">
        <AddEntityCard entityType={EntityType.DEBT} />
        {renderDebts}
      </div>
    </section>
  )
}
