"use client"
import Show from "@/shared/components/show"
import { Bolt, CalendarClock } from "lucide-react"
import { useUserContext } from "@/context/user.provider"
import SectionPanel from "@/shared/components/section-panel"
import IconContainer from "@/shared/components/icon-container"
import { formatDate } from "@/shared/lib/format-date"

export default function Page() {
  const [{ subscription }] = useUserContext()

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
            content={formatDate(subscription?.createdAt)}
          />
          <SectionPanel
            icon={
              <IconContainer>
                <CalendarClock className="h-4 w-4" />
              </IconContainer>
            }
            title="Subscription Valid Upto"
            content={formatDate(subscription?.endsAt)}
          />
        </section>
      </Show>
    </>
  )
}
