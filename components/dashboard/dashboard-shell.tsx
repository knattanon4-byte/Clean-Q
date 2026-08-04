"use client"

import { useMemo, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { AppSidebar, type NavKey } from "@/components/dashboard/app-sidebar"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { WeekSchedule } from "@/components/dashboard/week-schedule"
import { BookingsTable } from "@/components/dashboard/bookings-table"
import { AddBookingDialog } from "@/components/dashboard/add-booking-dialog"
import { type Booking, bookingTotal, toISODate } from "@/lib/cleanq-data"
import { SettingsPanel } from "@/components/dashboard/settings-panel"

const SECTION_TITLES: Record<NavKey, string> = {
  dashboard: "Dashboard",
  schedule: "7-Day Schedule",
  bookings: "Bookings",
  settings: "Settings",
}

export function DashboardShell() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [active, setActive] = useState<NavKey>("dashboard")
  const [collapsed, setCollapsed] = useState(false)

  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null)

  const todayISO = toISODate(new Date())

  useEffect(() => {
    async function fetchBookings() {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("scheduled_at", { ascending: false })

        if (error) throw error

        if (data) {
          const formattedData: Booking[] = data.map((row: any) => {
            const d = new Date(row.scheduled_at)
            
            const yyyy = d.getFullYear()
            const mm = String(d.getMonth() + 1).padStart(2, "0")
            const dd = String(d.getDate()).padStart(2, "0")
            
            const hours = String(d.getHours()).padStart(2, "0")
            const mins = String(d.getMinutes()).padStart(2, "0")

            return {
              id: row.id.toString(),
              customer: row.customer_name,
              date: `${yyyy}-${mm}-${dd}`,
              time: `${hours}:${mins}`,
              location: row.location,
              basePrice: row.base_price,
              addOns: row.add_ons || [],
              status: row.status || "pending",
            }
          })
          setBookings(formattedData)
        }
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const stats = useMemo(() => {
    const todaysBookings = bookings.filter((b) => b.date === todayISO).length
    const revenue = bookings.reduce((sum, b) => sum + bookingTotal(b), 0)
    const pendingJobs = bookings.filter((b) => b.status === "pending").length
    return { todaysBookings, revenue, pendingJobs }
  }, [bookings, todayISO])

  function handleAdd(newBooking: Omit<Booking, "id">) {
    setBookings((prev) => [
      { ...newBooking, id: `bk-${Date.now()}` },
      ...prev,
    ])
  }

  const displayBookings = selectedDateFilter 
    ? bookings.filter(b => b.date === selectedDateFilter)
    : bookings

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
          
          {active === "dashboard" && (
            <>
              <KpiCards
                todaysBookings={stats.todaysBookings}
                revenue={stats.revenue}
                pendingJobs={stats.pendingJobs}
              />
              <WeekSchedule 
                bookings={bookings} 
                selectedDate={selectedDateFilter} 
                onSelectDate={setSelectedDateFilter} 
              />
              <BookingsTable 
                bookings={displayBookings} 
                isLoading={isLoading} 
              />
            </>
          )}

          {active === "schedule" && (
            <WeekSchedule 
              bookings={bookings} 
              selectedDate={selectedDateFilter} 
              onSelectDate={setSelectedDateFilter} 
            />
          )}

          {active === "bookings" && (
            <BookingsTable 
              bookings={displayBookings} 
              isLoading={isLoading} 
            />
          )}

          {/* คืนค่าหน้า Settings ตัวจริงกลับมาแล้วครับ */}
          {active === "settings" && (
            <SettingsPanel />
          )}

        </div>
      </main>
    </div>
  )
}