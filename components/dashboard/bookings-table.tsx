"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPinIcon, Loader2, Edit2, Trash2, Calendar, MapPin, CheckCircle2, User } from "lucide-react"
import { type Booking, ADD_ONS, LOCATIONS, addOnsTotal, bookingTotal, formatCurrency } from "@/lib/cleanq-data"

function addOnLabels(ids: string[]): string {
  if (!ids || ids.length === 0) return "—"
  return ids.map((id) => ADD_ONS.find((a) => a.id === id)?.label).filter(Boolean).join(", ")
}

export function BookingsTable({ bookings = [], isLoading = false }: { bookings?: Booking[], isLoading?: boolean }) {
  const [location, setLocation] = useState<string>("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const filtered = useMemo(
    () => (location === "all" ? bookings : bookings.filter((b) => b.location === location)),
    [bookings, location],
  )

  const displayDate = (dateStr: string) => {
    if (!dateStr) return ""
    const [y, m, d] = dateStr.split("-")
    return `${d}/${m}/${y}`
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the booking for ${selectedBooking?.customer}?`)) {
      console.log("Deleted booking:", selectedBooking?.id)
      setSelectedBooking(null)
      // TODO: เรียกฟังก์ชัน Delete ไปที่ Supabase
    }
  }

  return (
    <>
      <Card className="rounded-3xl border-transparent shadow-[0_8px_30px_-12px_rgba(44,84,70,0.25)]">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">Bookings</CardTitle>
          <div className="flex items-center gap-2">
            <MapPinIcon className="size-4 text-muted-foreground" />
            <Select value={location} onValueChange={(value) => setLocation(value || "all")}>
              <SelectTrigger className="h-11 w-52 rounded-full px-4">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Locations</SelectItem>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4">Customer</TableHead>
                  <TableHead className="py-4">Location</TableHead>
                  <TableHead className="py-4 text-right">Base Price</TableHead>
                  <TableHead className="py-4">Add-ons</TableHead>
                  <TableHead className="py-4 text-right">Total Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="size-6 animate-spin text-primary" />
                        <span>Loading data from Supabase...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((b) => (
                    <TableRow 
                      key={b.id} 
                      // ทำให้กดได้ทั้งบรรทัด + เปลี่ยนสีตอนเอาเมาส์ชี้
                      onClick={() => setSelectedBooking(b)}
                      className="border-border/70 cursor-pointer hover:bg-muted/40 transition-colors"
                    >
                      <TableCell className="py-5">
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-medium text-primary text-left">
                            {b.customer}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {displayDate(b.date)} · {b.time}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <Badge variant="secondary" className="rounded-full font-normal">
                          {b.location}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-5 text-right tabular-nums text-muted-foreground">
                        {formatCurrency(b.basePrice)}
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex max-w-64 flex-col gap-0.5">
                          <span className="truncate text-sm text-muted-foreground">
                            {addOnLabels(b.addOns)}
                          </span>
                          {b.addOns && b.addOns.length > 0 && (
                            <span className="text-xs text-muted-foreground/70">
                              +{formatCurrency(addOnsTotal(b.addOns))}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-5 text-right font-semibold tabular-nums text-foreground">
                        {formatCurrency(bookingTotal(b))}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ปรับ Layout Popup ให้ดูโปรและไม่อึดอัด */}
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        {selectedBooking && (
          <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[24px] border-0 shadow-2xl">
            {/* ส่วนหัว */}
            <DialogHeader className="pt-6 px-6 pb-4 bg-muted/30 border-b border-border/50">
              <div className="flex flex-col gap-1.5 text-left pr-8">
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-xl font-semibold">Booking Details</DialogTitle>
                  <Badge 
                    variant={selectedBooking.status === "completed" ? "default" : "secondary"} 
                    className="px-2 py-0.5 text-[10px] uppercase tracking-wider"
                  >
                    {selectedBooking.status === "completed" && <CheckCircle2 className="size-3 mr-1 inline-flex" />}
                    {selectedBooking.status}
                  </Badge>
                </div>
                <DialogDescription>
                  Ref: <span className="font-mono text-xs text-muted-foreground/80">#{selectedBooking.id.split("-")[0]}</span>
                </DialogDescription>
              </div>
            </DialogHeader>

            {/* ส่วนรายละเอียด */}
            <div className="flex flex-col px-6 py-6 gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</span>
                <span className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="size-4 text-primary" /> {selectedBooking.customer}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted/10 p-4 rounded-xl border border-border/50">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Calendar className="size-3"/> Schedule</span>
                  <span className="text-sm font-medium">{displayDate(selectedBooking.date)}<br/><span className="text-muted-foreground">{selectedBooking.time}</span></span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><MapPin className="size-3"/> Location</span>
                  <span className="text-sm font-medium">{selectedBooking.location}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add-ons Selected</span>
                <span className="text-sm font-medium">{addOnLabels(selectedBooking.addOns)}</span>
              </div>

              {/* ส่วนราคา */}
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
                <span className="font-semibold text-foreground">Total Amount</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(bookingTotal(selectedBooking))}</span>
              </div>
            </div>

            {/* ส่วนปุ่ม (ปรับ Padding และเพิ่มพื้นหลังให้ดูแยกส่วนชัดเจน) */}
            <div className="flex items-center justify-between px-6 py-4 bg-muted/20 border-t border-border/50">
              <Button 
                variant="ghost" 
                onClick={handleDelete} 
                className="text-destructive hover:bg-destructive/10 hover:text-destructive px-3 -ml-3 rounded-full"
              >
                <Trash2 className="size-4 mr-2" /> Delete
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedBooking(null)} className="rounded-full px-5">Close</Button>
                <Button className="rounded-full px-5 shadow-sm">
                  <Edit2 className="size-4 mr-2" /> Edit Info
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}