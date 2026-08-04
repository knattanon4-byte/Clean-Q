"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { PlusIcon, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  type Booking,
  ADD_ONS,
  LOCATIONS,
  BASE_PRICE,
  addOnsTotal,
  formatCurrency,
} from "@/lib/cleanq-data"

export function AddBookingDialog({
  onAdd,
}: {
  onAdd: (booking: Omit<Booking, "id">) => void
}) {
  const [open, setOpen] = useState(false)
  const [customer, setCustomer] = useState("") 
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  
  // State สำหรับ Location Autocomplete (Combobox)
  const [openLocation, setOpenLocation] = useState(false)
  const [location, setLocation] = useState("")
  
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const total = BASE_PRICE + addOnsTotal(selectedAddOns)
  const isValid = customer.trim() && date && time && location

  function reset() {
    setCustomer("")
    setDate("")
    setTime("")
    setLocation("")
    setSelectedAddOns([])
  }

  function toggleAddOn(id: string, checked: boolean) {
    setSelectedAddOns((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id),
    )
  }

  async function handleSubmit() {
    if (!isValid) return
    setIsSubmitting(true)

    try {
      const scheduledAt = new Date(`${date}T${time}`).toISOString()
      
      // Payload ที่อัปเดตให้ตรงกับ Database 100%
      const newBookingData = {
        customer_name: customer.trim(),
        scheduled_at: scheduledAt,
        location: location,
        base_price: BASE_PRICE,
        add_ons: selectedAddOns,
        total_price: total, // ส่งราคารวมเข้า Database 
        status: "pending", // ค่า Default เริ่มต้น
      }

      const { error } = await supabase
        .from('bookings')
        .insert([newBookingData])

      if (error) throw error

      // ข้อมูลสำหรับเอาไปแสดงบนหน้า UI ทันทีหลังกด Save (แบบไม่ต้องรอโหลดหน้าใหม่)
      const bookingForUI: Omit<Booking, "id"> = {
        customer: customer.trim(),
        date,
        time,
        location,
        basePrice: BASE_PRICE,
        addOns: selectedAddOns,
        status: "pending",
      }
      
      onAdd(bookingForUI)
      reset()
      setOpen(false)

    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error)
      alert("ไม่สามารถบันทึกการจองได้ กรุณาลองเช็คข้อมูลอีกครั้งครับ")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset()
      }}
    >
      <DialogTrigger
        render={
          <Button size="lg" className="h-12 gap-2 rounded-full px-6 text-sm font-semibold" />
        }
      >
        <PlusIcon className="size-5" />
        Add Booking
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">New Booking</DialogTitle>
          <DialogDescription>
            Schedule a housekeeping visit and select any add-ons.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-0.5 py-1">
          <FieldGroup>
            
            <Field>
              <FieldLabel htmlFor="customer">Customer Name</FieldLabel>
              <Input
                id="customer"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="e.g. Amelia Hartman"
                className="h-11 rounded-xl"
              />
            </Field>

            <Field orientation="responsive">
              <Field>
                <FieldLabel htmlFor="date">Date</FieldLabel>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="time">Time</FieldLabel>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </Field>
            </Field>

            {/* Location Combobox (Autocomplete) */}
            <Field>
              <FieldLabel>Location</FieldLabel>
              <Popover open={openLocation} onOpenChange={setOpenLocation}>
                <PopoverTrigger
                  role="combobox"
                  aria-expanded={openLocation}
                  className="inline-flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-4 text-sm font-normal shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {location ? location : "Search a location..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </PopoverTrigger>
                
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search location..." />
                    <CommandList>
                      <CommandEmpty>No location found.</CommandEmpty>
                      <CommandGroup>
                        {LOCATIONS.map((loc) => (
                          <CommandItem
                            key={loc}
                            value={loc}
                            onSelect={() => {
                              setLocation(loc)
                              setOpenLocation(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                location === loc ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {loc}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </Field>

            <FieldSet>
              <FieldLegend variant="label">Add-ons</FieldLegend>
              <div className="flex flex-col gap-1">
                {ADD_ONS.map((addOn) => {
                  const checked = selectedAddOns.includes(addOn.id)
                  return (
                    <label
                      key={addOn.id}
                      htmlFor={`addon-${addOn.id}`}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-border px-4 py-3 transition-colors has-data-checked:border-primary/40 has-data-checked:bg-primary/5"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{addOn.label}</span>
                        <span className="text-xs text-muted-foreground">
                          +{formatCurrency(addOn.price)}
                        </span>
                      </div>
                      <Switch
                        id={`addon-${addOn.id}`}
                        checked={checked}
                        onCheckedChange={(value) => toggleAddOn(addOn.id, value)}
                      />
                    </label>
                  )
                })}
              </div>
            </FieldSet>
          </FieldGroup>
        </div>

        <DialogFooter className="items-center sm:justify-between">
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground">Total Price</span>
            <span className="text-2xl font-semibold tabular-nums text-primary">
              {formatCurrency(total)}
            </span>
          </div>
          <div className="flex gap-2">
            <DialogClose render={<Button variant="outline" className="h-11 rounded-full px-5" disabled={isSubmitting} />}>
              Cancel
            </DialogClose>
            <Button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="h-11 rounded-full px-6 font-semibold"
            >
              {isSubmitting ? "Saving..." : "Save Booking"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}