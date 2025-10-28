"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { Institution } from "@/shared/constants/types"
import LiabilityCard from "@/shared/components/dashboard-cards/liability-card"
import WealthCard from "@/shared/components/dashboard-cards/wealth-card"
import GoalDashboardCard from "@/shared/components/dashboard-cards/goal-dashboard-card"
import EMICard from "@/shared/components/dashboard-cards/emi-card"
import {
  AddEntityCard,
  EntityCard,
  EntityType,
} from "@/shared/components/entity-card"

export default function Page() {
  const institutions = useQuery<Institution[]>({
    queryKey: ["get-institutions"],
    queryUrl: endPoints.institution,
    method: HTTPMethods.GET,
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
      <section>
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <WealthCard />
            <GoalDashboardCard />
            <LiabilityCard />
            <EMICard />
          </div>
        </div>
      </section>
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4 pb-4">
          <AddEntityCard entityType={EntityType.INSTITUTION} />
          {renderInstitutions}
        </div>
      </section>
    </div>
  )
}
