export default function generateMonthList(startMonth: string) {
  if (!startMonth) return []

  const start = new Date(`${startMonth}-01`)
  const now = new Date()
  const months: { displayName: string; value: string }[] = []

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

  while (start <= now) {
    const year = start.getFullYear()
    const monthIndex = start.getMonth()
    const month = String(monthIndex + 1).padStart(2, "0")

    months.push({
      displayName: `${monthNames[monthIndex]} ${year}`,
      value: `${year}-${month}`,
    })

    start.setMonth(start.getMonth() + 1)
  }

  return months.reverse() // latest first
}
