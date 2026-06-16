"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { indicatorSpring, spatial } from "@/lib/motion"

export type ButtonGroupItem = {
  value: string
  label: string
  icon?: LucideIcon
}

type ButtonGroupProps = {
  items: ButtonGroupItem[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}

// Material 3 connected button group — segmented pill row with an animated
// secondary-container indicator that morphs to the selected segment.
function ButtonGroup({ items, value, onValueChange, className }: ButtonGroupProps) {
  const reduceMotion = useReducedMotion()
  const indicatorId = React.useId()

  return (
    <div
      role="group"
      className={cn(
        "bg-surface-container inline-flex w-fit items-stretch gap-0.5 rounded-full p-0.5",
        className
      )}
    >
      {items.map(({ value: v, label, icon: Icon }) => {
        const selected = v === value
        return (
          <motion.button
            key={v}
            type="button"
            onClick={() => onValueChange(v)}
            aria-pressed={selected}
            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
            transition={spatial.fast}
            className={cn(
              "state-layer-on-surface md-label-large relative flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-primary/40",
              "[&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0",
              selected ? "text-on-secondary-container" : "text-on-surface-variant"
            )}
          >
            {selected && (
              <motion.span
                layoutId={`button-group-indicator-${indicatorId}`}
                transition={indicatorSpring}
                className="bg-secondary-container absolute inset-0 -z-10 rounded-[var(--radius-sm)]"
              />
            )}
            {Icon && <Icon />}
            {label}
          </motion.button>
        )
      })}
    </div>
  )
}

export { ButtonGroup }
