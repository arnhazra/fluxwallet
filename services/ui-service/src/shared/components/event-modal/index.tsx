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

export function EventModal({
  open,
  onOpenChange,
  events,
  date,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  events: PlannerEvent[]
  date: Date
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Events for {format(date, "PPP")}</AlertDialogTitle>
        </AlertDialogHeader>
        {events && events.length > 0 ? (
          <ul className="space-y-2">
            {events.map((event, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                <span className="text-zinc-200 text-sm">{event.eventName}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-zinc-400 text-sm">No events for this date.</div>
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
