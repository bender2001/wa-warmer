"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { indicatorSpring } from "@/lib/motion"

type NavRailItem = {
  value: string
  label: string
  icon: LucideIcon
}

type NavRailProps = {
  items: NavRailItem[]
  value: string
  onValueChange: (value: string) => void
}

// Material 3 desktop navigation rail — vertical column with a sliding pill indicator.
function NavRail({ items, value, onValueChange }: NavRailProps) {
  return (
    <nav className="flex flex-col items-center gap-2">
      {items.map((item) => {
        const active = item.value === value
        const Icon = item.icon
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onValueChange(item.value)}
            className="state-layer-on-surface relative flex w-full flex-col items-center gap-1 rounded-[var(--radius-lg)] py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-primary/40"
          >
            <span className="relative flex h-8 w-14 items-center justify-center">
              {active && (
                <motion.span
                  layoutId="rail-pill"
                  transition={indicatorSpring}
                  className="absolute inset-0 rounded-full bg-secondary-container md-elevation-0"
                />
              )}
              <Icon
                size={24}
                className={cn(
                  "relative z-10",
                  active ? "text-on-secondary-container" : "text-on-surface-variant"
                )}
              />
            </span>
            <span
              className={cn(
                "md-label-medium",
                active ? "text-on-surface" : "text-on-surface-variant"
              )}
            >
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export { NavRail }
