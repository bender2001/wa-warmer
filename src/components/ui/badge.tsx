import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Material 3 chips/badges: M3 chip shape is small 8dp (NOT pill). rounded-full is
// reserved for the tiny circular status dot variant. Container tonal color roles + label type.
const badgeVariants = cva(
  "relative inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-0.5 md-label-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3.5 [&>svg]:pointer-events-none transition-colors overflow-hidden outline-none focus-visible:ring-secondary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
  {
    variants: {
      variant: {
        // M3 status roles
        success: "bg-success-container text-on-success-container",
        warning: "bg-warning-container text-on-warning-container",
        danger: "bg-danger-container text-on-danger-container",
        // M3 assist / filter chips (interactive — state layer)
        assist:
          "border border-outline-variant bg-surface text-on-surface-variant",
        filter:
          "border border-outline-variant bg-surface text-on-surface-variant state-layer-on-surface data-[selected=true]:bg-secondary-container data-[selected=true]:text-on-secondary-container data-[selected=true]:border-transparent data-[selected=true]:state-layer-on-secondary-container",
        // aliases
        default: "bg-primary text-on-primary",
        secondary: "bg-secondary-container text-on-secondary-container",
        outline: "border border-outline-variant text-on-surface",
        destructive: "bg-danger-container text-on-danger-container",
        // tiny circular status dot — the only place rounded-full belongs
        dot: "rounded-full size-2 p-0 gap-0 bg-danger [&>svg]:hidden",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
