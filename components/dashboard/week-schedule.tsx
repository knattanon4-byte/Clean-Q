"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Booking } from "@/lib/cleanq-data"

interface WeekScheduleProps {
  bookings?: Booking[]
  selectedDate?: string | null
  onSelectDate?: (date: string | null) => void
}

export function WeekSchedule({ bookings = [], selectedDate, onSelectDate }: WeekScheduleProps) {
  // ฟังก์ชันสร้างวันที่ 7 วันล่วงหน้า
  const getNext7Days = () => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      days.push({
        fullDate: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: d.getDate().toString()
      })
    }
    return days
  }

  const weekDays = getNext7Days()

  return (
    <Card className="rounded-3xl border-transparent shadow-[0_8px_30px_-12px_rgba(44,84,70,0.25)]">
      <CardHeader>
        <CardTitle className="text-lg">7-Day Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {weekDays.map((d) => {
            const jobsCount = bookings.filter((b) => b.date === d.fullDate).length
            const isSelected = selectedDate === d.fullDate

            return (
              <div
                key={d.fullDate}
                // ถ้ากดการ์ดเดิมซ้ำ ให้ส่งค่า null ไปเพื่อยกเลิก Filter
                onClick={() => onSelectDate?.(isSelected ? null : d.fullDate)}
                className={`flex flex-col p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected 
                    ? "bg-primary text-primary-foreground border-primary shadow-md transform scale-[1.02]" 
                    : "bg-muted/10 border-border hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                <div className="flex justify-between items-start w-full mb-4">
                  <span className={`font-medium ${isSelected ? "text-primary-foreground" : "text-foreground"}`}>
                    {d.dayName}
                  </span>
                  <span className={`text-sm ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {d.dateNum}
                  </span>
                </div>
                <span className={`text-xs mt-auto font-medium ${
                  isSelected ? "text-primary-foreground/90" 
                  : jobsCount > 0 ? "text-primary" : "text-muted-foreground"
                }`}>
                  {jobsCount > 0 ? `${jobsCount} jobs` : "No jobs"}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}