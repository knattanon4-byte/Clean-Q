"use client"

import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPinIcon } from "lucide-react"
import {
  type Booking,
  ADD_ONS,
  LOCATIONS,
  addOnsTotal,
  bookingTotal,
  formatCurrency,
} from "@/lib/cleanq-data"

function addOnLabels(ids: string[]): string {
  if (ids.length === 0) return "—"
  return ids
    .map((id) => ADD_ONS.find((a) => a.id === id)?.label)
    .filter(Boolean)
    .join(", ")
}

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const [location, setLocation] = useState<string>("all")

  const filtered = useMemo(
    () => (location === "all" ? bookings : bookings.filter((b) => b.location === location)),
    [bookings, location],
  )

  return (
    <Card className="rounded-3xl border-transparent shadow-[0_8px_30px_-12px_rgba(44,84,70,0.25)]">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-lg">Bookings</CardTitle>
        <div className="flex items-center gap-2">
          <MapPinIcon className="size-4 text-muted-foreground" />
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="h-11 w-52 rounded-full px-4">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Locations</SelectItem>
                {LOCATIONS.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
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
              {filtered.map((b) => (
                <TableRow key={b.id} className="border-border/70">
                  <TableCell className="py-5">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{b.customer}</span>
                      <span className="text-xs text-muted-foreground">
                        {b.date} · {b.time}
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
                      {b.addOns.length > 0 && (
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
              ))}
              {filtered.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    No bookings for this location.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
