import { format } from "date-fns"

export function formatDate(
  dateString: string | number | null | undefined | Date
) {
  return format(dateString ? new Date(dateString) : new Date(), "MMM, do yyyy")
}
