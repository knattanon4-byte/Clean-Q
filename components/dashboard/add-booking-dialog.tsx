"use client"

import { useState } from "react"
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusIcon } from "lucide-react"
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
  const [location, setLocation] = useState("")
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])

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

  function handleSubmit() {
    if (!isValid) return
    const booking: Omit<Booking, "id"> = {
      customer: customer.trim(),
      date,
      time,
      location,
      basePrice: BASE_PRICE,
      addOns: selectedAddOns,
      status: "pending",
    }
    onAdd(booking)
    reset()
    setOpen(false)
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

            <Field>
              <FieldLabel>Location</FieldLabel>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="h-11 w-full rounded-xl px-4">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {LOCATIONS.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
            <DialogClose render={<Button variant="outline" className="h-11 rounded-full px-5" />}>
              Cancel
            </DialogClose>
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="h-11 rounded-full px-6 font-semibold"
            >
              Save Booking
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
