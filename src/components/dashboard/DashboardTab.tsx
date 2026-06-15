"use client";

import { useMemo } from "react";
import { useWarmer } from "@/hooks/useWarmer";
import { computeStats } from "@/lib/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ChatPairsPanel } from "@/components/dashboard/ChatPairsPanel";

export function DashboardTab() {
  const { accounts, logs, chatPairs } = useWarmer();
  const stats = useMemo(() => computeStats(accounts), [accounts]);

  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed logs={logs} />
          </CardContent>
        </Card>

        <QuickActions stats={stats} />
      </div>

      <ChatPairsPanel chatPairs={chatPairs} />
    </div>
  );
}
