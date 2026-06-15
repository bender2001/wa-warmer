"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ACCENT, STATS } from "@/lib/account-meta";
import type { Stats } from "@/types";
import { cn } from "@/lib/utils";

export function StatsGrid({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {STATS.map((s) => {
        const Icon = s.icon;
        return (
          <Card key={s.key} variant="filled">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2.5 rounded-2xl", ACCENT[s.accent])}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant">{s.label}</p>
                  <p className="text-3xl font-semibold tabular-nums">
                    {s.value(stats)}
                    {s.sub && (
                      <span className="text-sm text-on-surface-variant">
                        {s.sub(stats)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
