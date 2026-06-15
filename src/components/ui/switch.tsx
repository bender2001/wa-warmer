"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

// Material 3 switch: larger track, outlined when off, thumb grows when on.
function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-8 w-[3.25rem] shrink-0 items-center rounded-full border-2 transition-colors outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=unchecked]:bg-surface-container-highest data-[state=unchecked]:border-outline",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full shadow-sm transition-all data-[state=checked]:size-6 data-[state=checked]:translate-x-[1.55rem] data-[state=checked]:bg-on-primary data-[state=unchecked]:size-4 data-[state=unchecked]:translate-x-1 data-[state=unchecked]:bg-outline"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
