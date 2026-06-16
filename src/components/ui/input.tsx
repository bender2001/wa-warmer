import * as React from "react"

import { cn } from "@/lib/utils"

// Material 3 outlined text field: taller, 4dp radius (extra-small), flat, 2px focus border.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "md-body-large file:text-on-surface placeholder:text-on-surface-variant selection:bg-primary selection:text-on-primary border-outline text-on-surface flex h-12 w-full min-w-0 rounded-[var(--radius-xs)] border bg-transparent px-4 py-1 transition-[color,border,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:md-label-large disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "hover:border-on-surface",
        "focus-visible:border-primary focus-visible:border-2 focus-visible:px-[15px] focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_12%,transparent)]",
        "aria-invalid:border-error aria-invalid:border-2 aria-invalid:px-[15px] aria-invalid:focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-error)_12%,transparent)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
