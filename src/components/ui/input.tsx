import * as React from "react"

import { cn } from "@/lib/utils"

// Material 3 outlined text field: taller, 12px radius, flat, 2px focus border.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-on-surface-variant selection:bg-primary selection:text-on-primary border-outline text-on-surface flex h-12 w-full min-w-0 rounded-[var(--radius-sm)] border bg-transparent px-4 py-1 text-base transition-[color,border] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-primary focus-visible:border-2 focus-visible:px-[15px]",
        "aria-invalid:border-destructive aria-invalid:border-2",
        className
      )}
      {...props}
    />
  )
}

export { Input }
