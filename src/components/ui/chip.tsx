"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { badgeVariants } from "@/components/ui/badge"
import { spring } from "@/lib/motion"

type FilterChipProps = Omit<React.ComponentProps<typeof motion.button>, "children"> & {
  selected?: boolean
  /** override the selected tint, e.g. "data-[selected=true]:bg-success-container ..." */
  selectedClassName?: string
  children?: React.ReactNode
}

// Material 3 filter chip — pill, leading check when selected, springy press.
function FilterChip({
  className,
  selectedClassName,
  selected = false,
  children,
  ...props
}: FilterChipProps) {
  return (
    <motion.button
      type="button"
      data-selected={selected}
      whileTap={{ scale: 0.94 }}
      transition={spring.fast}
      className={cn(
        badgeVariants({ variant: "filter" }),
        "state-layer-on-surface h-8 cursor-pointer px-4 text-sm",
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
