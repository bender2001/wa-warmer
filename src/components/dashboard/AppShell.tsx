"use client";

import { type ReactNode } from "react";
import { RefreshCw, Terminal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <aside className="hidden lg:flex sticky top-0 h-screen w-[88px] shrink-0 flex-col items-center gap-4 border-r border-outline-variant bg-surface-container py-4">
        <div className="grid size-11 place-items-center rounded-2xl bg-primary text-on-primary">
          <Terminal className="h-5 w-5" />
        </div>
        <NavRail items={NAV} value={activeTab} onValueChange={setActiveTab} />
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top app bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-outline-variant bg-surface/80 px-4 backdrop-blur sm:px-6">
          <div className="grid size-11 place-items-center rounded-2xl bg-primary text-on-primary lg:hidden">
            <Terminal className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[1.375rem] font-semibold tracking-[-0.01em]">
              {title}
            </h1>
            <p className="hidden text-xs text-on-surface-variant sm:block">
              Local Mode
            </p>
          </div>
          <div className="flex-1" />
          <Badge variant={connected ? "success" : "secondary"}>
            {connected ? "Connected" : "Offline"}
          </Badge>
          <Button variant="text" size="icon" onClick={refetchAll}>
            <RefreshCw className="h-4 w-4" />
          </Button>
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
        className="lg:hidden"
      />
    </div>
  );
}
