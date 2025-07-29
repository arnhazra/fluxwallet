"use client"
import SectionPanel from "../../../../shared/components/sectionpanel"
import Show from "@/shared/components/show"
import { format } from "date-fns"
import { Bolt, CalendarClock } from "lucide-react"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import { useAppContext } from "@/context/appstate.provider"
import notify from "@/shared/hooks/use-notify"
import { uiConstants } from "@/shared/constants/global-constants"

export default function Page() {
  const [{ subscription, isSubscriptionActive }] = useAppContext()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const subscriptionSuccess = searchParams.get("subscriptionSuccess")
    if (subscriptionSuccess !== null) {
      if (subscriptionSuccess === "true") {
        notify(uiConstants.subscriptionSuccess, "error")
        router.push("/settings/subscription")
      }

      if (subscriptionSuccess === "false") {
        notify(uiConstants.subscriptionFailed, "error")
        router.push("/settings/subscription")
      }
    }
  }, [searchParams])

  return (
    <>
      <Show condition={!isSubscriptionActive}>
        <SectionPanel
          icon={<CalendarClock className="scale-75" />}
          title="Your Subscription"
          content="You don't have a subscription"
        />
      </Show>
      <Show condition={!!isSubscriptionActive}>
        <section className="grid gap-2">
          <SectionPanel
            icon={<Bolt className="scale-75" />}
            title="Your Subscription"
            content="You have an active subscription"
          />
          <SectionPanel
            icon={<CalendarClock className="scale-75" />}
            title="Subscription Start Date"
            content={format(
              subscription?.createdAt
                ? new Date(subscription.createdAt)
                : new Date(),
              "MMM, do yyyy, h:mm a"
            )}
          />
          <SectionPanel
            icon={<CalendarClock className="scale-75" />}
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
