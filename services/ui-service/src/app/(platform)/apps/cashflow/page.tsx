"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Cashflow } from "@/shared/constants/types"
import { AddEntityCard, EntityCard } from "@/shared/components/entity-card"
import { EntityType } from "@/shared/components/entity-card/data"
import { useUserContext } from "@/context/user.provider"
import { buildQueryUrl } from "@/shared/lib/build-url"

export default function Page() {
  const [{ searchKeyword }] = useUserContext()
  const cashflows = useQuery<Cashflow[]>({
    queryKey: ["get-cashflows", searchKeyword],
    queryUrl: buildQueryUrl(endPoints.cashflow, {
      searchKeyword: encodeURIComponent(searchKeyword),
    }),
    method: HTTPMethods.GET,
    suspense: !!searchKeyword ? false : true,
  })

  const renderCashflows = cashflows?.data?.map((cashflow) => (
    <EntityCard
      entityType={EntityType.CASHFLOW}
      entity={cashflow}
      key={cashflow._id}
    />
  ))

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
          <AddEntityCard entityType={EntityType.CASHFLOW} />
          {renderCashflows}
        </div>
      </section>
    </div>
  )
}
