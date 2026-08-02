"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboardIcon,
  CalendarDaysIcon,
  ClipboardListIcon,
  SettingsIcon,
  SparklesIcon,
  PanelLeftIcon,
} from "lucide-react"

export type NavKey = "dashboard" | "schedule" | "bookings" | "settings"

const NAV_ITEMS: { key: NavKey; label: string; icon: typeof LayoutDashboardIcon }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { key: "schedule", label: "7-Day Schedule", icon: CalendarDaysIcon },
  { key: "bookings", label: "Bookings", icon: ClipboardListIcon },
  { key: "settings", label: "Settings", icon: SettingsIcon },
]

export function AppSidebar({
  active,
  onNavigate,
  collapsed,
  onToggle,
}: {
  active: NavKey
  onNavigate: (key: NavKey) => void
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <aside
      className={cn(
        "sticky top-0 flex h-dvh shrink-0 flex-col gap-2 bg-sidebar p-4 text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex items-center gap-3 px-1 py-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground">
          <SparklesIcon className="size-5" />
        </span>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold tracking-tight">CleanQ</span>
            <span className="text-xs text-sidebar-foreground/70">Housekeeping Admin</span>
          </div>
        )}
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = item.key === active
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-full py-3 pl-3 pr-4 text-left text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full",
                  isActive
                    ? "bg-sidebar-primary-foreground/15"
                    : "bg-sidebar-accent/60",
                )}
              >
                <Icon className="size-5" />
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <Button
        variant="ghost"
        onClick={onToggle}
        className={cn(
          "h-11 justify-start gap-3 rounded-full px-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          collapsed && "justify-center px-0",
        )}
      >
        <PanelLeftIcon className="size-5" />
        {!collapsed && <span>Collapse</span>}
      </Button>
    </aside>
  )
}
