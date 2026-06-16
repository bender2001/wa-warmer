"use client"

import { FilterChip } from "@/components/ui/chip"
import { useUiStore } from "@/stores/ui-store"
import type { PoolView } from "@/types"

const POOLS: { value: PoolView; label: string; selectedClassName?: string }[] = [
  { value: "all", label: "All" },
  {
    value: "active",
    label: "Active",
    selectedClassName:
      "data-[selected=true]:bg-success-container data-[selected=true]:text-on-success-container",
  },
  {
    value: "idle",
    label: "Idle",
    selectedClassName:
      "data-[selected=true]:bg-warning-container data-[selected=true]:text-on-warning-container",
  },
  {
    value: "offline",
    label: "Offline",
    selectedClassName:
      "data-[selected=true]:bg-danger-container data-[selected=true]:text-on-danger-container",
  },
]

export function PoolFilter() {
  const poolView = useUiStore((s) => s.poolView)
  const setPoolView = useUiStore((s) => s.setPoolView)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="md-label-medium text-on-surface-variant">Pool:</span>
      {POOLS.map((pool) => (
        <FilterChip
          key={pool.value}
          selected={poolView === pool.value}
          selectedClassName={pool.selectedClassName}
          onClick={() => setPoolView(pool.value)}
        >
          {pool.label}
        </FilterChip>
      ))}
    </div>
  )
}
