"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { fabMotion } from "@/lib/motion"

type FabProps = React.ComponentProps<typeof motion.button> & {
  icon?: React.ReactNode
  label?: string
  /** when false, collapse to an icon-only 56px FAB */
  extended?: boolean
}

// Material 3 (extended) FAB — floating primary action.
function Fab({
  className,
  icon = <Plus className="size-6" />,
  label = "Add Account",
  extended = true,
  ...props
}: FabProps) {
  return (
    <motion.button
      type="button"
      variants={fabMotion}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap="tap"
      layout
      className={cn(
        "state-layer-on-primary-container bg-primary-container text-on-primary-container fixed bottom-6 right-6 z-40 inline-flex h-14 items-center justify-center gap-3 rounded-[var(--radius-lg)] md-elevation-3 transition-shadow hover:md-elevation-4",
        extended ? "px-5" : "w-14 px-0",
        className
      )}
      aria-label={label}
      {...props}
    >
      {icon}
      {extended && (
        <motion.span
          layout
          className="md-label-large whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}
    </motion.button>
  )
}

export { Fab }
