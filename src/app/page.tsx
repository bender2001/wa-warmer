"use client";

import type { ComponentType } from "react";

import { WarmerProvider } from "@/hooks/useWarmer";
import { useUiStore } from "@/stores/ui-store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Fab } from "@/components/ui/fab";
import { AppShell } from "@/components/dashboard/AppShell";
import { DashboardTab } from "@/components/dashboard/DashboardTab";
import { AccountsTab } from "@/components/dashboard/AccountsTab";
import { ChatLogTab } from "@/components/dashboard/ChatLogTab";
import { AiSettings } from "@/components/dashboard/AiSettings";
import { AddAccountDialog } from "@/components/dashboard/dialogs/AddAccountDialog";
import { DeleteAccountDialog } from "@/components/dashboard/dialogs/DeleteAccountDialog";
import { AccountDetailDialog } from "@/components/dashboard/dialogs/AccountDetailDialog";
import { QrDialog } from "@/components/dashboard/dialogs/QrDialog";

const TABS: Record<string, ComponentType> = {
  dashboard: DashboardTab,
  accounts: AccountsTab,
  chatlog: ChatLogTab,
  settings: AiSettings,
};

function Shell() {
  const activeTab = useUiStore((s) => s.activeTab);
  const setAddOpen = useUiStore((s) => s.setAddOpen);
  const ActiveTab = TABS[activeTab] ?? DashboardTab;

  return (
    <>
      <AppShell>
        <ActiveTab />
      </AppShell>
      <Fab onClick={() => setAddOpen(true)} className="bottom-24 lg:bottom-6" />
      <AddAccountDialog />
      <DeleteAccountDialog />
      <AccountDetailDialog />
      <QrDialog />
    </>
  );
}

export default function Page() {
  return (
    <WarmerProvider>
      <TooltipProvider delayDuration={200}>
        <Shell />
      </TooltipProvider>
    </WarmerProvider>
  );
}
