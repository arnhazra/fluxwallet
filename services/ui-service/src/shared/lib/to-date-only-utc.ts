export function toDateOnlyUTC(input?: Date | string): string {
  const d = input ? new Date(input) : new Date()

  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(d.getUTCDate()).padStart(2, "0")

  return `${yyyy}-${mm}-${dd}`
}
