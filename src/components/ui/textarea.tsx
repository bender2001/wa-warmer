import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-outline placeholder:text-on-surface-variant text-on-surface focus-visible:border-primary focus-visible:border-2 aria-invalid:border-error flex field-sizing-content min-h-16 w-full rounded-[var(--radius-xs)] border bg-transparent px-4 py-3 md-body-large transition-[color,border] outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
