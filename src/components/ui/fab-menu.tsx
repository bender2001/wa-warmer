"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Plus, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { fabMotion, listItem, spatial } from "@/lib/motion"

type FabMenuAction = {
  label: string
  icon: React.ReactNode
  onClick: () => void
}

type FabMenuProps = {
  actions: FabMenuAction[]
  icon?: React.ReactNode
  label?: string
  className?: string
}

// Material 3 expressive FAB that expands into a vertical list of labeled actions.
function FabMenu({
  actions,
  icon = <Plus className="size-6" />,
  label = "Actions",
  className,
}: FabMenuProps) {
  const [open, setOpen] = React.useState(false)
  const reduce = useReducedMotion()

  return (
    <div className={cn("fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3", className)}>
      <AnimatePresence>
        {open && (
          <motion.ul
            className="flex flex-col items-end gap-2"
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
              closed: { transition: { staggerChildren: 0.03, staggerDirection: 1 } },
            }}
          >
            {actions.map((action) => (
              <motion.li
                key={action.label}
                variants={listItem}
                exit={{ opacity: 0, y: 8, transition: spatial.fast }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    action.onClick()
                  }}
                  className="state-layer-on-surface bg-surface-container text-on-surface relative inline-flex h-12 items-center gap-3 rounded-full px-4 md-elevation-2 md-label-large outline-none focus-visible:ring-[3px] focus-visible:ring-primary/40"
                >
                  <span className="inline-flex size-5 items-center justify-center">
                    {action.icon}
                  </span>
                  <span className="whitespace-nowrap">{action.label}</span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        variants={fabMotion}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileTap="tap"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-expanded={open}
        className="state-layer-on-primary-container bg-primary-container text-on-primary-container inline-flex size-14 items-center justify-center rounded-[var(--radius-lg)] md-elevation-3 transition-shadow hover:md-elevation-4 outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50"
      >
        <motion.span
          animate={{ rotate: open ? 135 : 0 }}
          transition={reduce ? { duration: 0 } : spatial.fast}
          className="inline-flex items-center justify-center"
        >
          {open ? <X className="size-6" /> : icon}
        </motion.span>
      </motion.button>
    </div>
  )
}

export { FabMenu }
