"use client"

import { useMemo, useState } from "react"
import { AppSidebar, type NavKey } from "@/components/dashboard/app-sidebar"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { WeekSchedule } from "@/components/dashboard/week-schedule"
import { BookingsTable } from "@/components/dashboard/bookings-table"
import { AddBookingDialog } from "@/components/dashboard/add-booking-dialog"
import {
  type Booking,
  INITIAL_BOOKINGS,
  bookingTotal,
  toISODate,
} from "@/lib/cleanq-data"

const SECTION_TITLES: Record<NavKey, string> = {
  dashboard: "Dashboard",
  schedule: "7-Day Schedule",
  bookings: "Bookings",
  settings: "Settings",
}

export function DashboardShell() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS)
  const [active, setActive] = useState<NavKey>("dashboard")
  const [collapsed, setCollapsed] = useState(false)

  const todayISO = toISODate(new Date())

  const stats = useMemo(() => {
    const todaysBookings = bookings.filter((b) => b.date === todayISO).length
    const revenue = bookings.reduce((sum, b) => sum + bookingTotal(b), 0)
    const pendingJobs = bookings.filter((b) => b.status === "pending").length
    return { todaysBookings, revenue, pendingJobs }
  }, [bookings, todayISO])

  function handleAdd(booking: Omit<Booking, "id">) {
    setBookings((prev) => [
      { ...booking, id: `bk-${Date.now()}` },
      ...prev,
    ])
  }

  return (
    <div className="flex min-h-dvh bg-background">
      <AppSidebar
        active={active}
        onNavigate={setActive}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      <main className="flex-1 overflow-x-hidden">
        <header className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              {SECTION_TITLES[active]}
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back — here&apos;s what&apos;s happening with CleanQ today.
            </p>
          </div>
          <AddBookingDialog onAdd={handleAdd} />
        </header>

        <div className="flex flex-col gap-6 px-6 pb-12 lg:px-10">
          <KpiCards
            todaysBookings={stats.todaysBookings}
            revenue={stats.revenue}
            pendingJobs={stats.pendingJobs}
          />
          <WeekSchedule bookings={bookings} />
          <BookingsTable bookings={bookings} />
        </div>
      </main>
    </div>
  )
}
