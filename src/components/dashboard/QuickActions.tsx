"use client";

import { Plus, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUiStore } from "@/stores/ui-store";
import { useWarmer } from "@/hooks/useWarmer";
import type { Stats } from "@/types";

export function QuickActions({ stats }: { stats: Stats }) {
  const setAddOpen = useUiStore((s) => s.setAddOpen);
  const { rotatePools } = useWarmer();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <Button variant="filled" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add WhatsApp Account
          </Button>
          <Button variant="outlined" onClick={rotatePools}>
            <RotateCw className="h-4 w-4 mr-2" />
            Rotate Pools
          </Button>
          <div className="mt-2 rounded-2xl bg-surface-container p-3">
            <p className="mb-2 text-xs text-on-surface-variant">Pool Status</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="text-sm">Active: {stats.activePool}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-warning" />
                <span className="text-sm">Idle: {stats.idlePool}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
