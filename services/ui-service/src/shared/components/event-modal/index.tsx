import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { PlannerEvent } from "@/shared/constants/types"
import { format } from "date-fns"
import SectionPanel from "../section-panel"
import { Calendar, Plus, Trash } from "lucide-react"
import IconContainer from "../icon-container"
import { Button } from "../ui/button"
import Show from "../show"
import ky from "ky"
import { endPoints } from "@/shared/constants/api-endpoints"
import notify from "@/shared/hooks/use-notify"
import Link from "next/link"

export function EventModal({
  open,
  onOpenChange,
  events,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  events: PlannerEvent[]
}) {
  const deleteEvent = async (eventId: string): Promise<void> => {
    try {
      await ky.delete(`${endPoints.events}/${eventId}`)
      onOpenChange(false)
      notify("Event deleted successfully.", "success")
    } catch (error) {
      notify("Failed to delete event.", "error")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Events</AlertDialogTitle>
        </AlertDialogHeader>
        {events && events.length > 0 ? (
          <ul className="space-y-2">
            {events.map((event, idx) => (
              <SectionPanel
                key={event._id}
                icon={
                  <IconContainer>
                    <Calendar className="h-4 w-4" />
                  </IconContainer>
                }
                title={event.eventName}
                content={format(event.eventDate, "PPP")}
                actionComponents={[
                  <Show condition={event.eventSource === "Custom"}>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={(): Promise<void> => deleteEvent(event._id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </Show>,
                ]}
              />
            ))}
          </ul>
        ) : (
          <>
            <div className="text-zinc-400 text-sm">
              No events for this date.
            </div>
            <Link href="/apps/planner/addevent">
              <Button
                variant="default"
                className=" bg-primary text-black hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </Link>
          </>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(): void => onOpenChange(false)}>
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
