import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Material 3 Expressive buttons: pill shape, state-layer hover, label-large text.
const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-[0.01em] transition-all duration-200 select-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[18px] shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // M3 roles
        filled:
          "bg-primary text-on-primary shadow-xs hover:shadow-sm state-layer-on-primary",
        tonal:
          "bg-secondary-container text-on-secondary-container state-layer-on-secondary-container",
        elevated:
          "bg-surface-container-low text-primary shadow-sm hover:shadow-md state-layer-primary",
        outlined:
          "border border-outline bg-transparent text-primary state-layer-primary",
        text: "bg-transparent text-primary px-3 state-layer-primary",
        // aliases mapped to M3 (keep existing call-sites working)
        default:
          "bg-primary text-on-primary shadow-xs hover:shadow-sm state-layer-on-primary",
        secondary:
          "bg-secondary-container text-on-secondary-container state-layer-on-secondary-container",
        outline:
          "border border-outline bg-transparent text-primary state-layer-primary",
        ghost: "bg-transparent text-on-surface state-layer-on-surface",
        destructive:
          "bg-destructive text-on-error shadow-xs state-layer-on-error focus-visible:ring-destructive/20",
        link: "bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 has-[>svg]:px-5",
        sm: "h-8 px-4 gap-1.5 has-[>svg]:px-3",
        lg: "h-12 px-8 text-base has-[>svg]:px-6",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
