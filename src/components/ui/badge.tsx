import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Material 3 Expressive chips/badges: pill shape, container tonal roles.
const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3.5 [&>svg]:pointer-events-none transition-colors overflow-hidden focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        // M3 status roles
        success: "bg-success-container text-on-success-container",
        warning: "bg-warning-container text-on-warning-container",
        danger: "bg-danger-container text-on-danger-container",
        // M3 assist / filter chips
        assist:
          "border border-outline-variant bg-surface text-on-surface-variant",
        filter:
          "border border-outline-variant bg-surface text-on-surface-variant data-[selected=true]:bg-secondary-container data-[selected=true]:text-on-secondary-container data-[selected=true]:border-transparent",
        // aliases
        default: "bg-primary text-on-primary",
        secondary: "bg-secondary-container text-on-secondary-container",
        outline: "border border-outline-variant text-on-surface",
        destructive: "bg-destructive text-on-error",
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
