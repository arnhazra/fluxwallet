"use client"
import Show from "@/shared/components/show"
import { format } from "date-fns"
import { Bolt, CalendarClock } from "lucide-react"
import { useAppContext } from "@/context/appstate.provider"
import SectionPanel from "@/shared/components/sectionpanel"

export default function Page() {
  const [{ subscription, isSubscriptionActive }] = useAppContext()

  return (
    <>
      <Show condition={!isSubscriptionActive}>
        <SectionPanel
          icon={<CalendarClock className="h-4 w-4" />}
          title="Your Subscription"
          content="You don't have a subscription"
        />
      </Show>
      <Show condition={!!isSubscriptionActive}>
        <section className="grid gap-2">
          <SectionPanel
            icon={<Bolt className="h-4 w-4" />}
            title="Your Subscription"
            content="You have an active subscription"
          />
          <SectionPanel
            icon={<CalendarClock className="h-4 w-4" />}
            title="Subscription Start Date"
            content={format(
              subscription?.createdAt
                ? new Date(subscription.createdAt)
                : new Date(),
              "MMM, do yyyy, h:mm a"
            )}
          />
          <SectionPanel
            icon={<CalendarClock className="h-4 w-4" />}
            title="Subscription Valid Upto"
            content={
              subscription?.endsAt?.includes("9999")
                ? "Never Expires"
                : format(
                    subscription?.endsAt
                      ? new Date(subscription.endsAt)
                      : new Date(),
                    "MMM, do yyyy, h:mm a"
                  )
            }
          />
        </section>
      </Show>
    </>
  )
}
