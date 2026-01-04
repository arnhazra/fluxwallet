"use client"

import { useState } from "react"
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

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const events = [
    {
      date: "2026-01-08",
      name: "event A",
      color: "bg-pink-500",
    },
    {
      date: "2026-01-08",
      name: "event B",
      color: "bg-blue-500",
    },
    {
      date: "2026-01-18",
      name: "Team Sync",
      color: "bg-green-500",
    },
  ]

  // Navigation handlers
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  // Calendar generation logic
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

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
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-3 text-center text-sm font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid flex-1 grid-cols-7">
            {calendarDays.map((day, i) => {
              const dayIsoString = format(day, "yyyy-MM-dd")
              const dayEvents = events.filter((e) => e.date === dayIsoString)
              const isToday = isSameDay(day, new Date())

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "group relative border-b border-r border-border p-2 transition-colors hover:bg-zinc-900/50",
                    i % 7 === 6 && "border-r-0",
                    i >= calendarDays.length - 7 && "border-b-0"
                  )}
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
                    {dayEvents.map((event, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[10px] leading-tight"
                      >
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <div
                            className={cn(
                              "h-1.5 w-1.5 shrink-0 rounded-full",
                              event.color
                            )}
                          />
                          <span className="truncate text-zinc-300">
                            {event.name}
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
    </div>
  )
}
