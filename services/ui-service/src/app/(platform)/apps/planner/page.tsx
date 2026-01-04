"use client"
import { useEffect, useState } from "react"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns"
import useQuery from "@/shared/hooks/use-query"
import { PlannerEvent } from "@/shared/constants/types"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  const [selectedMonth, setSelectedMonth] = useState(
    `${format(currentDate, "yyyy-MM")}`
  )

  useEffect(() => {
    setSelectedMonth(`${format(currentDate, "yyyy-MM")}`)
  }, [currentDate])

  const events = useQuery<PlannerEvent[]>({
    queryKey: ["planner-events", selectedMonth],
    queryUrl: `${endPoints.events}/${selectedMonth}`,
    method: HTTPMethods.GET,
  })

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedDate(null)
  }

  const selectedDateIso = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null
  const selectedDateEvents = selectedDateIso
    ? events.data?.filter(
        (e) => format(e.eventDate, "yyyy-MM-dd") === selectedDateIso
      )
    : []

  return (
    <div className="flex h-screen flex-col pb-4 text-zinc-400">
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <header className="flex h-16 items-center justify-between border-b border-border px-6">
          <h1 className="text-xl font-medium tracking-tight text-zinc-100">
            {format(currentDate, "MMM, yyyy")}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-md border border-border p-0.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevMonth}
                className="h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous month</span>
              </Button>
              <div className="h-4 w-px bg-zinc-800" />
              <Button
                variant="ghost"
                size="icon"
                onClick={nextMonth}
                className="h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next month</span>
              </Button>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col">
          <div className="grid grid-cols-7 border-b border-border">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-3 text-center text-sm font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid flex-1 grid-cols-7">
            {calendarDays.map((day, i) => {
              const dayIsoString = format(day, "yyyy-MM-dd")
              const dayEvents = events.data?.filter(
                (e) => format(e.eventDate, "yyyy-MM-dd") === dayIsoString
              )
              const isToday = isSameDay(day, new Date())

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "group relative border-b border-r border-border p-2 transition-colors hover:bg-zinc-900/50 cursor-pointer",
                    i % 7 === 6 && "border-r-0",
                    i >= calendarDays.length - 7 && "border-b-0"
                  )}
                  onClick={() => handleDateClick(day)}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center text-sm font-medium rounded-full transition-colors",
                      isSameMonth(day, monthStart)
                        ? "text-zinc-200"
                        : "text-zinc-600",
                      isToday && "bg-zinc-100 text-black"
                    )}
                  >
                    {day.getDate()}
                  </span>

                  <div className="mt-2 space-y-1">
                    {dayEvents?.map((event, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[10px] leading-tight"
                      >
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <div
                            className={cn(
                              "h-3 w-3 shrink-0 rounded-full",
                              `bg-green-500`
                            )}
                          />
                          <span className="truncate text-zinc-300">
                            {event.eventName}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>
      {/* Modal for selected date events */}
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-zinc-900 rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw] relative">
            <button
              className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-100"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-2 text-zinc-100">
              Events for {format(selectedDate, "PPP")}
            </h2>
            {selectedDateEvents && selectedDateEvents.length > 0 ? (
              <ul className="space-y-2">
                {selectedDateEvents.map((event, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-zinc-200 text-sm">
                      {event.eventName}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-zinc-400 text-sm">
                No events for this date.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
