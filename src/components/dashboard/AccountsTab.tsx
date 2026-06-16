"use client";

import { useMemo } from "react";
import { useWarmer } from "@/hooks/useWarmer";
import { useUiStore } from "@/stores/ui-store";
import { filterAccounts } from "@/lib/stats";
import { PoolFilter } from "@/components/dashboard/PoolFilter";
import { AccountGrid } from "@/components/dashboard/AccountGrid";
import { BannedAccounts } from "@/components/dashboard/BannedAccounts";

export function AccountsTab() {
  const { accounts } = useWarmer();
  const poolView = useUiStore((s) => s.poolView);

  const filtered = useMemo(() => filterAccounts(accounts, poolView), [accounts, poolView]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="md-headline-small text-on-surface">Account Management</h2>
          <p className="md-body-medium text-on-surface-variant">{filtered.length} accounts</p>
        </div>
      </div>

      <PoolFilter />

      <AccountGrid accounts={filtered} />

      <BannedAccounts />
    </div>
  );
}
