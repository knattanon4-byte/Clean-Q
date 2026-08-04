export type AddOn = {
  id: string
  label: string
  price: number
}

export const ADD_ONS: AddOn[] = [
  { id: "deep-clean", label: "Deep Clean", price: 45 },
  { id: "laundry", label: "Laundry & Ironing", price: 25 },
  { id: "windows", label: "Interior Windows", price: 20 },
  { id: "fridge", label: "Inside Fridge", price: 18 },
  { id: "oven", label: "Inside Oven", price: 22 },
]

// เปลี่ยนให้ LOCATIONS เป็นแบบเปิดที่แก้ไข/เพิ่ม-ลด ผ่านระบบได้
export let LOCATIONS = [
  "Downtown",
  "Riverside",
  "Hillcrest",
  "Northgate",
  "Seaview",
  "Maple Park",
]

// ฟังก์ชันสำหรับอัปเดตรายชื่อเมืองจากหน้า Settings
export function updateLocations(newLocations: string[]) {
  LOCATIONS = newLocations
}

export const BASE_PRICE = 80

export type Booking = {
  id: string
  customer: string
  location: string
  date: string // ISO date
  time: string // e.g. "09:00"
  basePrice: number
  addOns: string[] // add-on ids
  status: "confirmed" | "pending" | "completed"
}

export function addOnsTotal(ids: string[]): number {
  return ids.reduce((sum, id) => {
    const found = ADD_ONS.find((a) => a.id === id)
    return sum + (found?.price ?? 0)
  }, 0)
}

export function bookingTotal(b: Pick<Booking, "basePrice" | "addOns">): number {
  return b.basePrice + addOnsTotal(b.addOns)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value)
}

// Build a week starting Monday of the current week
export function getWeekDays(reference = new Date()): Date[] {
  const d = new Date(reference)
  const day = d.getDay() // 0 = Sun
  const diffToMonday = (day + 6) % 7
  const monday = new Date(d)
  monday.setDate(d.getDate() - diffToMonday)
  monday.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const next = new Date(monday)
    next.setDate(monday.getDate() + i)
    return next
  })
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function iso(offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return toISODate(d)
}

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "bk-1001",
    customer: "Amelia Hartman",
    location: "Downtown",
    date: iso(0),
    time: "08:30",
    basePrice: BASE_PRICE,
    addOns: ["deep-clean", "windows"],
    status: "confirmed",
  },
  {
    id: "bk-1002",
    customer: "Marcus Lee",
    location: "Riverside",
    date: iso(0),
    time: "11:00",
    basePrice: BASE_PRICE,
    addOns: ["laundry"],
    status: "pending",
  },
  {
    id: "bk-1003",
    customer: "Sofia Nguyen",
    location: "Hillcrest",
    date: iso(1),
    time: "09:00",
    basePrice: BASE_PRICE,
    addOns: ["fridge", "oven"],
    status: "confirmed",
  },
  {
    id: "bk-1004",
    customer: "Daniel Okafor",
    location: "Northgate",
    date: iso(1),
    time: "14:00",
    basePrice: BASE_PRICE,
    addOns: [],
    status: "pending",
  },
  {
    id: "bk-1005",
    customer: "Priya Sharma",
    location: "Seaview",
    date: iso(2),
    time: "10:30",
    basePrice: BASE_PRICE,
    addOns: ["deep-clean", "laundry", "windows"],
    status: "confirmed",
  },
  {
    id: "bk-1006",
    customer: "Liam Brooks",
    location: "Maple Park",
    date: iso(3),
    time: "13:00",
    basePrice: BASE_PRICE,
    addOns: ["oven"],
    status: "pending",
  },
  {
    id: "bk-1007",
    customer: "Chloe Martin",
    location: "Downtown",
    date: iso(4),
    time: "08:00",
    basePrice: BASE_PRICE,
    addOns: ["deep-clean"],
    status: "confirmed",
  },
  {
    id: "bk-1008",
    customer: "Noah Williams",
    location: "Riverside",
    date: iso(5),
    time: "15:30",
    basePrice: BASE_PRICE,
    addOns: ["fridge"],
    status: "completed",
  },
]