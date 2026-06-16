"use client";

import { type ReactNode } from "react";
import { RefreshCw, Terminal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { NavBar } from "@/components/ui/nav-bar";
import { NavRail } from "@/components/ui/nav-rail";
import { NAV } from "@/components/dashboard/nav-items";
import { useWarmer } from "@/hooks/useWarmer";
import { useUiStore } from "@/stores/ui-store";

export function AppShell({ children }: { children: ReactNode }) {
  const activeTab = useUiStore((s) => s.activeTab);
  const setActiveTab = useUiStore((s) => s.setActiveTab);
  const { connected, refetchAll } = useWarmer();

  const title = NAV.find((n) => n.value === activeTab)?.label ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      {/* Desktop navigation rail */}
      <aside className="hidden lg:flex sticky top-0 h-screen w-24 shrink-0 flex-col items-center gap-4 border-r border-outline-variant bg-surface md-elevation-0 py-4">
        <div className="grid size-11 place-items-center rounded-[var(--radius-md)] bg-primary text-on-primary">
          <Terminal className="h-5 w-5" />
        </div>
        <NavRail items={NAV} value={activeTab} onValueChange={setActiveTab} />
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top app bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-outline-variant bg-surface/80 px-4 backdrop-blur sm:px-6">
          <div className="grid size-11 place-items-center rounded-[var(--radius-md)] bg-primary text-on-primary lg:hidden">
            <Terminal className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="md-title-large truncate">{title}</h1>
            <p className="md-label-medium hidden text-on-surface-variant sm:block">
              Local Mode
            </p>
          </div>
          <div className="flex-1" />
          <Badge variant={connected ? "success" : "secondary"}>
            {connected ? "Connected" : "Offline"}
          </Badge>
          <IconButton variant="standard" onClick={refetchAll} aria-label="Refresh">
            <RefreshCw className="h-4 w-4" />
          </IconButton>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <NavBar
        items={NAV}
        value={activeTab}
        onValueChange={setActiveTab}
        className="md-elevation-2 lg:hidden"
      />
    </div>
  );
}
