import { format } from "date-fns"

export function formatDate(
  dateString: string | number | null | undefined | Date,
  showDate: boolean = true
) {
  if (showDate) {
    return format(
      dateString ? new Date(dateString) : new Date(),
      "MMM, do yyyy"
    )
  }

  return format(dateString ? new Date(dateString) : new Date(), "MMM yyyy")
}
