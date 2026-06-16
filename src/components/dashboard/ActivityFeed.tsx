"use client";

import { Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { logColor } from "@/lib/account-meta";
import { timeOf } from "@/lib/format";
import { motion, useReducedMotion } from "framer-motion";
import { listItem } from "@/lib/motion";
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
  const reduced = useReducedMotion();

  return (
    <ScrollArea className={height}>
      <div className="space-y-1">
        {logs.slice(0, limit).map((log) => (
          <motion.div
            key={log.id}
            variants={reduced ? undefined : listItem}
            initial={reduced ? false : "initial"}
            animate="animate"
            className="flex items-start gap-2 md-body-small py-1.5 px-2 rounded-[var(--radius-md)]"
          >
            <span className="md-label-small text-on-surface-variant shrink-0 tabular-nums">
              {timeOf(log.timestamp)}
            </span>
            <span className={cn("shrink-0", logColor(log.type))}>
              <Activity className="h-3.5 w-3.5" />
            </span>
            <span className="text-on-surface-variant flex-1 truncate">
              {log.message}
            </span>
          </motion.div>
        ))}
        {logs.length === 0 && (
          <div className="text-center py-8 text-on-surface-variant">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="md-body-medium">No activity yet</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
