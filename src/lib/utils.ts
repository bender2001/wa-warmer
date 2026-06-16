import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const ROLES = ["display", "headline", "title", "body", "label"] as const
const SIZES = ["large", "medium", "small"] as const
// Custom M3 type-scale utilities (md-title-large, md-body-small-emphasized, …)
const TYPE_SCALE = ROLES.flatMap((r) =>
  SIZES.flatMap((s) => [`md-${r}-${s}`, `md-${r}-${s}-emphasized`])
)

// Teach tailwind-merge about our custom @utility families so conflicting
// md-* type / elevation classes dedupe (last one wins) like real Tailwind utilities.
const twMerge = extendTailwindMerge<"md-elevation" | "md-typescale">({
  extend: {
    classGroups: {
      "md-elevation": [
        "md-elevation-0",
        "md-elevation-1",
        "md-elevation-2",
        "md-elevation-3",
        "md-elevation-4",
        "md-elevation-5",
      ],
      "md-typescale": TYPE_SCALE,
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
