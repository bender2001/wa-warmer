"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"
import { spatial, effects } from "@/lib/motion"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const reduceMotion = useReducedMotion()

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer state-layer-on-surface relative size-5 shrink-0 rounded-[var(--radius-xs)]",
        "border-2 border-outline bg-transparent text-on-primary outline-none",
        "transition-colors",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "aria-invalid:border-error aria-invalid:focus-visible:ring-error",
        "disabled:cursor-not-allowed disabled:opacity-[0.38] disabled:border-on-surface",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
        asChild
      >
        <motion.span
          initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduceMotion ? effects.fast : spatial.fast}
        >
          <CheckIcon className="size-3.5" strokeWidth={3} />
        </motion.span>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
