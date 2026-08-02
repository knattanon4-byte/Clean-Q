"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  type Booking,
  getWeekDays,
  toISODate,
} from "@/lib/cleanq-data"

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function WeekSchedule({ bookings }: { bookings: Booking[] }) {
  const week = getWeekDays()
  // Compute "today" only after mount to avoid SSR/client hydration mismatches
  // caused by timezone/timing differences.
  const [todayISO, setTodayISO] = useState<string | null>(null)

  useEffect(() => {
    setTodayISO(toISODate(new Date()))
  }, [])

  return (
    <Card className="rounded-3xl border-transparent shadow-[0_8px_30px_-12px_rgba(44,84,70,0.25)]">
      <CardHeader>
        <CardTitle className="text-lg">7-Day Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {week.map((day, i) => {
            const dayISO = toISODate(day)
            const isToday = dayISO === todayISO
            const slots = bookings
              .filter((b) => b.date === dayISO)
              .sort((a, b) => a.time.localeCompare(b.time))

            return (
              <div
                key={dayISO}
                className={cn(
                  "flex min-h-44 flex-col gap-2 rounded-2xl border p-3",
                  isToday ? "border-primary/40 bg-primary/5" : "border-border bg-muted/40",
                )}
              >
                <div className="flex items-baseline justify-between">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isToday ? "text-primary" : "text-foreground",
                    )}
                  >
                    {DAY_LABELS[i]}
                  </span>
                  <span className="text-xs text-muted-foreground">{day.getDate()}</span>
                </div>

                <div className="flex flex-col gap-2">
                  {slots.length === 0 && (
                    <span className="text-xs text-muted-foreground/70">No jobs</span>
                  )}
                  {slots.map((s) => (
                    <div
                      key={s.id}
                      className={cn(
                        "rounded-xl px-2.5 py-2 text-xs leading-tight",
                        s.status === "pending"
                          ? "bg-accent text-accent-foreground"
                          : "bg-primary text-primary-foreground",
                      )}
                    >
                      <div className="font-semibold">{s.time}</div>
                      <div className="truncate opacity-90">{s.customer}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
