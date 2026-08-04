"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Users, DollarSign, Settings2, Plus, Trash2, Check } from "lucide-react"

// กำหนด Type ให้ชัดเจน
type LocationConfig = {
  id: string
  name: string
  basePrice: number
  standbyTeams: number
}

const INITIAL_LOCATIONS: LocationConfig[] = [
  { id: "loc-1", name: "Hillcrest", basePrice: 80, standbyTeams: 2 },
  { id: "loc-2", name: "Downtown", basePrice: 100, standbyTeams: 4 },
  { id: "loc-3", name: "Westside", basePrice: 90, standbyTeams: 3 },
]

export function SettingsPanel() {
  const [isEditing, setIsEditing] = useState(false)
  const [locations, setLocations] = useState<LocationConfig[]>(INITIAL_LOCATIONS)

  // ฟังก์ชันอัปเดตข้อมูล
  const handleUpdate = (id: string, field: keyof LocationConfig, value: string | number) => {
    setLocations(prev => prev.map(loc => loc.id === id ? { ...loc, [field]: value } : loc))
  }

  // ฟังก์ชันเพิ่มเมืองใหม่
  const handleAddLocation = () => {
    const newLoc: LocationConfig = {
      id: `loc-${Date.now()}`,
      name: "New Area",
      basePrice: 0,
      standbyTeams: 1,
    }
    setLocations([...locations, newLoc])
  }

  // ฟังก์ชันลบเมือง
  const handleRemoveLocation = (id: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="rounded-3xl border-transparent shadow-[0_8px_30px_-12px_rgba(44,84,70,0.25)]">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              Service Areas & Pricing
            </CardTitle>
            <CardDescription>
              จัดการพื้นที่ให้บริการ ราคาเริ่มต้น และทีมสแตนบาย
            </CardDescription>
          </div>
          {/* ปุ่มสลับโหมด View / Edit */}
          <Button 
            variant={isEditing ? "default" : "outline"} 
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-full"
          >
            {isEditing ? (
              <><Check className="mr-2 size-4" /> Done Editing</>
            ) : (
              <><Settings2 className="mr-2 size-4" /> Edit Config</>
            )}
          </Button>
        </CardHeader>

        <CardContent>
          {!isEditing ? (
            // โหมด: View (คลีนๆ ไม่รก)
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {locations.map((loc) => (
                <div key={loc.id} className="flex flex-col p-4 border rounded-2xl bg-muted/20">
                  <span className="font-semibold text-foreground text-lg">{loc.name}</span>
                  <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><DollarSign className="size-4"/> {loc.basePrice} Base</span>
                    <span className="flex items-center gap-1"><Users className="size-4"/> {loc.standbyTeams} Teams</span>
                  </div>
                </div>
              ))}
              {locations.length === 0 && <p className="text-muted-foreground">No locations configured.</p>}
            </div>
          ) : (
            // โหมด: Edit (แก้ไขตาราง เพิ่ม/ลบ ได้)
            <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area Name</TableHead>
                    <TableHead>Base Price ($)</TableHead>
                    <TableHead>Standby Teams</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.map((loc) => (
                    <TableRow key={loc.id}>
                      <TableCell>
                        <Input 
                          value={loc.name}
                          onChange={(e) => handleUpdate(loc.id, "name", e.target.value)}
                          className="h-9"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DollarSign className="size-4 text-muted-foreground" />
                          <Input 
                            type="number" 
                            value={loc.basePrice}
                            onChange={(e) => handleUpdate(loc.id, "basePrice", Number(e.target.value))}
                            className="w-24 h-9"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-muted-foreground" />
                          <Input 
                            type="number" 
                            value={loc.standbyTeams}
                            onChange={(e) => handleUpdate(loc.id, "standbyTeams", Number(e.target.value))}
                            className="w-20 h-9"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveLocation(loc.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="secondary" onClick={handleAddLocation} className="w-fit border-dashed border-2">
                <Plus className="mr-2 size-4" /> Add New Area
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}