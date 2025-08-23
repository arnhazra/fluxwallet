"use client"
import {
  OverviewCard,
  IntelligenceCard,
  ControlCard,
} from "@/shared/components/marketing-cards"

export default function Page() {
  return (
    <div className="mx-auto grid justify-center gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <OverviewCard />
      <IntelligenceCard />
      <ControlCard />
      <OverviewCard />
      <IntelligenceCard />
      <ControlCard />
    </div>
  )
}
