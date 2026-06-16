"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ACCENT, STATS } from "@/lib/account-meta";
import type { Stats } from "@/types";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { spatial } from "@/lib/motion";

export function StatsGrid({ stats }: { stats: Stats }) {
  const reduce = useReducedMotion();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {STATS.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.key}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spatial.default, delay: reduce ? 0 : i * 0.04 }}
            whileHover={reduce ? undefined : { y: -2 }}
          >
            <Card variant="filled">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2.5 rounded-[var(--radius-md)] shrink-0",
                      ACCENT[s.accent]
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="md-label-medium text-on-surface-variant truncate">
                      {s.label}
                    </p>
                    <p className="md-display-small tabular-nums text-on-surface">
                      {s.value(stats)}
                      {s.sub && (
                        <span className="md-label-large text-on-surface-variant">
                          {s.sub(stats)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
