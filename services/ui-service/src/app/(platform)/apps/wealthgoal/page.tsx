"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Goal } from "@/shared/constants/types"
import { AddEntityCard, EntityCard } from "@/shared/components/entity-card"
import { EntityType } from "@/shared/components/entity-card/data"

export default function Page() {
  const goals = useQuery<Goal[]>({
    queryKey: ["get-goals"],
    queryUrl: endPoints.goal,
    method: HTTPMethods.GET,
  })

  const renderGoals = goals?.data?.map((goal) => (
    <EntityCard entityType={EntityType.GOAL} entity={goal} key={goal._id} />
  ))

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
          <AddEntityCard entityType={EntityType.GOAL} />
          {renderGoals}
        </div>
      </section>
    </div>
  )
}
