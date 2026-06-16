"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "state-layer-on-surface relative inline-flex items-center justify-center gap-2 rounded-full md-label-large text-on-surface-variant whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-primary/40 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-38 data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container aria-invalid:ring-error/30 aria-invalid:text-error [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[18px] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-outline bg-transparent data-[state=on]:border-transparent",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
