"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Material 3 Expressive split button: filled primary action + menu trigger.
// Outer corners full (pill), inner corners small (8dp), 2dp gap between segments.
function SplitButton({
  children,
  onClick,
  menu,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  menu: React.ReactNode
}) {
  return (
    <div
      data-slot="split-button"
      className={cn(
        "inline-flex items-stretch gap-0.5 md-elevation-0",
        className
      )}
    >
      <button
        type="button"
        data-slot="split-button-action"
        onClick={onClick}
        className="relative inline-flex h-10 items-center justify-center gap-2 rounded-l-full rounded-r-[var(--radius-sm)] bg-primary px-6 md-label-large text-on-primary outline-none transition-all duration-200 select-none state-layer-on-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]"
        {...props}
      >
        {children}
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            data-slot="split-button-trigger"
            aria-label="More actions"
            className="relative inline-flex h-10 items-center justify-center rounded-l-[var(--radius-sm)] rounded-r-full bg-primary px-3 text-on-primary outline-none transition-all duration-200 select-none state-layer-on-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 [&>svg]:size-[18px] data-[state=open]:[&>svg]:rotate-180 [&>svg]:transition-transform [&>svg]:duration-200"
          >
            <ChevronDown />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">{menu}</DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export { SplitButton }
