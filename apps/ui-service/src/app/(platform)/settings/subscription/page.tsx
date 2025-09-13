"use client"
import Show from "@/shared/components/show"
import { format } from "date-fns"
import { Bolt, CalendarClock } from "lucide-react"
import { userUser } from "@/context/user.provider"
import SectionPanel from "@/shared/components/section-panel"
import IconContainer from "@/shared/components/icon-container"

export default function Page() {
  const [{ subscription }] = userUser()

  return (
    <>
      <Show condition={!subscription?.isActive}>
        <SectionPanel
          icon={
            <IconContainer>
              <CalendarClock className="h-4 w-4" />
            </IconContainer>
          }
          title="Your Subscription"
          content="You don't have a subscription"
        />
      </Show>
      <Show condition={!!subscription?.isActive}>
        <section className="grid gap-2">
          <SectionPanel
            icon={
              <IconContainer>
                <Bolt className="h-4 w-4" />
              </IconContainer>
            }
            title="Your Subscription"
            content="Active"
          />
          <SectionPanel
            icon={
              <IconContainer>
                <CalendarClock className="h-4 w-4" />
              </IconContainer>
            }
            title="Subscription Start Date"
            content={format(
              subscription?.createdAt
                ? new Date(subscription.createdAt)
                : new Date(),
              "MMM, do yyyy, h:mm a"
            )}
          />
          <SectionPanel
            icon={
              <IconContainer>
                <CalendarClock className="h-4 w-4" />
              </IconContainer>
            }
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
