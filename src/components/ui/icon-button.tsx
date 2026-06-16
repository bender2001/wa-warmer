"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Material 3 Expressive icon button: round, state-layer hover, single icon child.
const iconButtonVariants = cva(
  "relative inline-grid place-items-center rounded-full transition-all duration-200 select-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-6 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        filled:
          "bg-primary text-on-primary md-elevation-0 state-layer-on-primary",
        tonal:
          "bg-secondary-container text-on-secondary-container state-layer-on-secondary-container",
        outlined:
          "border border-outline bg-transparent text-on-surface-variant state-layer-on-surface-variant",
        standard:
          "bg-transparent text-on-surface-variant state-layer-on-surface-variant",
      },
      size: {
        sm: "size-9",
        default: "size-10",
        lg: "size-12",
      },
    },
    defaultVariants: {
      variant: "standard",
      size: "default",
    },
  }
)

function IconButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof iconButtonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="icon-button"
      className={cn(iconButtonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { IconButton, iconButtonVariants }
