export function generateMonthList(startMonth: string | null | undefined) {
  if (!startMonth) {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    startMonth = `${year}-${month}`
  }

  const start = new Date(`${startMonth}-01`)
  const now = new Date()
  const months: string[] = []

  while (start <= now) {
    const year = start.getFullYear()
    const monthIndex = start.getMonth()
    const month = String(monthIndex + 1).padStart(2, "0")
    months.push(`${year}-${month}`)
    start.setMonth(start.getMonth() + 1)
  }

  return months.reverse()
}

export function getCurrentMonthString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

export function getNameFromMonthValue(month: string | null | undefined) {
  if (!month) return ""
  const date = new Date(`${month}-01`)

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  const year = date.getFullYear()
  const monthIndex = date.getMonth()
  return `${monthNames[monthIndex]} ${year}`
}
