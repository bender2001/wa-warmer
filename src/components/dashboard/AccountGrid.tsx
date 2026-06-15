"use client";

import { Users, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/ui-store";
import { AccountCard } from "@/components/dashboard/AccountCard";
import type { Account } from "@/types";

export function AccountGrid({ accounts }: { accounts: Account[] }) {
  const setAddOpen = useUiStore((s) => s.setAddOpen);

  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-on-surface-variant mb-4" />
            <h3 className="text-base font-semibold text-on-surface mb-1">No Accounts</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Add a WhatsApp account to start warming.
            </p>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
}
