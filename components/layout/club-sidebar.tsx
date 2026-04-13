"use client"

import {
  IconBuildingStadium,
  IconCalendarEvent,
  IconCategory,
  IconClipboardList,
  IconLayoutDashboard,
  IconSettings,
  IconTournament,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { ComponentType } from "react"

export type IconKey =
  | "dashboard"
  | "tournaments"
  | "categories"
  | "registrations"
  | "matches"
  | "teams"
  | "players"
  | "club"
  | "settings"

export type NavItem = {
  href: string
  label: string
  iconKey: IconKey
  description: string
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

const iconByKey: Record<IconKey, ComponentType<{ className?: string }>> = {
  dashboard: IconLayoutDashboard,
  tournaments: IconTournament,
  categories: IconCategory,
  registrations: IconClipboardList,
  matches: IconCalendarEvent,
  teams: IconUsersGroup,
  players: IconUsers,
  club: IconBuildingStadium,
  settings: IconSettings,
}

export function ClubSidebar({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/clubs") return pathname === "/clubs"
    return pathname.startsWith(href)
  }

  return (
    <aside className="h-fit rounded-2xl border bg-card p-3 shadow-sm lg:sticky lg:top-6">
      <nav className="grid gap-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
              {group.label}
            </p>
            <div className="grid gap-0.5">
              {group.items.map((item) => {
                const Icon = iconByKey[item.iconKey]
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[18px] shrink-0 transition-colors",
                        active
                          ? "text-primary"
                          : "text-muted-foreground/60 group-hover:text-foreground"
                      )}
                    />
                    <div className="min-w-0">
                      <p className="truncate leading-tight">{item.label}</p>
                      <p
                        className={cn(
                          "mt-0.5 truncate text-[11px] leading-tight",
                          active
                            ? "text-primary/60"
                            : "text-muted-foreground/50"
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
