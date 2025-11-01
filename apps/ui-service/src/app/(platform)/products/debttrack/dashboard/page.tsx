"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Debt } from "@/shared/constants/types"
import { AddEntityCard, EntityCard } from "@/shared/components/entity-card"
import { EntityType } from "@/shared/components/entity-card/data"
import StatCardStack from "@/shared/components/stat-card/stat-card-stack"

export default function Page() {
  const debts = useQuery<Debt[]>({
    queryKey: ["get-debts"],
    queryUrl: endPoints.debt,
    method: HTTPMethods.GET,
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
