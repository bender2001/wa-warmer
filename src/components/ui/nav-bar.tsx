"use client"

import * as React from "react"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { indicatorSpring } from "@/lib/motion"

export type NavItem = {
  value: string
  label: string
  icon: LucideIcon
}

type NavBarProps = {
  items: NavItem[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}

// Material 3 bottom navigation bar (mobile). Active item shows an animated pill.
function NavBar({ items, value, onValueChange, className }: NavBarProps) {
  return (
    <nav
      className={cn(
        "bg-surface-container border-outline-variant fixed inset-x-0 bottom-0 z-40 flex h-20 items-stretch justify-around border-t px-2 pb-[env(safe-area-inset-bottom)]",
        className
      )}
    >
      {items.map(({ value: v, label, icon: Icon }) => {
        const active = v === value
        return (
          <button
            key={v}
            type="button"
            onClick={() => onValueChange(v)}
            className="group relative flex flex-1 flex-col items-center justify-center gap-1 pt-2"
            aria-current={active ? "page" : undefined}
          >
            <span className="relative flex h-8 w-16 items-center justify-center">
              {active && (
                <motion.span
                  layoutId="navbar-pill"
                  transition={indicatorSpring}
                  className="bg-secondary-container absolute inset-0 rounded-full"
                />
              )}
              <Icon
                className={cn(
                  "relative size-[22px] transition-colors",
                  active
                    ? "text-on-secondary-container"
                    : "text-on-surface-variant"
                )}
              />
            </span>
            <span
              className={cn(
                "text-xs font-medium tracking-[0.02em] transition-colors",
                active ? "text-on-surface" : "text-on-surface-variant"
              )}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export { NavBar }
