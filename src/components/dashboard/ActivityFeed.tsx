"use client";

import { Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { logColor } from "@/lib/account-meta";
import { timeOf } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Log } from "@/types";

export function ActivityFeed({
  logs,
  limit = 20,
  height = "h-64",
}: {
  logs: Log[];
  limit?: number;
  height?: string;
}) {
  return (
    <ScrollArea className={height}>
      <div className="space-y-2">
        {logs.slice(0, limit).map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-2 text-xs py-1.5 px-2 rounded-lg hover:bg-surface-container"
          >
            <span className="text-on-surface-variant shrink-0 tabular-nums">
              {timeOf(log.timestamp)}
            </span>
            <span className={cn("shrink-0", logColor(log.type))}>
              <Activity className="h-3.5 w-3.5" />
            </span>
            <span className="text-on-surface-variant flex-1 truncate">
              {log.message}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center py-8 text-on-surface-variant">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activity yet</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
