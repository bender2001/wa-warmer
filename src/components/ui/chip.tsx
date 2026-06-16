"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { badgeVariants } from "@/components/ui/badge"
import { spatial } from "@/lib/motion"

type FilterChipProps = Omit<React.ComponentProps<typeof motion.button>, "children"> & {
  selected?: boolean
  /** override the selected tint, e.g. "data-[selected=true]:bg-success-container ..." */
  selectedClassName?: string
  children?: React.ReactNode
}

// Material 3 filter chip — small (8dp) shape, leading check when selected, springy press.
function FilterChip({
  className,
  selectedClassName,
  selected = false,
  children,
  ...props
}: FilterChipProps) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.button
      type="button"
      data-selected={selected}
      whileTap={reduceMotion ? undefined : { scale: 0.94 }}
      transition={spatial.fast}
      className={cn(
        badgeVariants({ variant: "filter" }),
        "state-layer-on-surface md-label-large h-8 cursor-pointer rounded-[var(--radius-sm)] px-4 outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50",
        selectedClassName,
        className
      )}
      {...props}
    >
      {selected && <Check className="size-4" />}
      {children}
    </motion.button>
  )
}

export { FilterChip }
