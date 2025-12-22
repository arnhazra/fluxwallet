export function normalizeToUTCNoon(date: Date | undefined): Date {
  if (!date) {
    const today = new Date()
    return new Date(
      Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        12,
        0,
        0,
        0
      )
    )
  }

  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0)
  )
}
