"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CalendarCheckIcon, DollarSignIcon, ClockIcon } from "lucide-react"
import { formatCurrency } from "@/lib/cleanq-data"

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string
  hint: string
  icon: typeof CalendarCheckIcon
}) {
  return (
    <Card className="rounded-3xl border-transparent bg-card shadow-[0_8px_30px_-12px_rgba(44,84,70,0.25)]">
      <CardContent className="flex items-center gap-4 p-6">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Icon className="size-6" />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <span className="text-3xl font-semibold tracking-tight text-foreground">{value}</span>
          <span className="text-xs text-muted-foreground">{hint}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function KpiCards({
  todaysBookings,
  revenue,
  pendingJobs,
}: {
  todaysBookings: number
  revenue: number
  pendingJobs: number
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <KpiCard
        label="Today's Bookings"
        value={String(todaysBookings)}
        hint="Scheduled for today"
        icon={CalendarCheckIcon}
      />
      <KpiCard
        label="Revenue"
        value={formatCurrency(revenue)}
        hint="Projected this week"
        icon={DollarSignIcon}
      />
      <KpiCard
        label="Pending Jobs"
        value={String(pendingJobs)}
        hint="Awaiting confirmation"
        icon={ClockIcon}
      />
    </div>
  )
}
