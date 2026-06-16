"use client";

import { Plus, RotateCw } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { shapeMorph } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUiStore } from "@/stores/ui-store";
import { useWarmer } from "@/hooks/useWarmer";
import type { Stats } from "@/types";

export function QuickActions({ stats }: { stats: Stats }) {
  const setAddOpen = useUiStore((s) => s.setAddOpen);
  const { rotatePools } = useWarmer();
  const reduced = useReducedMotion();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="md-title-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <motion.div
            variants={shapeMorph}
            initial="rest"
            whileTap={reduced ? undefined : "press"}
          >
            <Button
              variant="filled"
              className="w-full"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="mr-2 h-[18px] w-[18px]" />
              Add WhatsApp Account
            </Button>
          </motion.div>
          <motion.div
            variants={shapeMorph}
            initial="rest"
            whileTap={reduced ? undefined : "press"}
          >
            <Button variant="outlined" className="w-full" onClick={rotatePools}>
              <RotateCw className="mr-2 h-[18px] w-[18px]" />
              Rotate Pools
            </Button>
          </motion.div>
          <div className="mt-2 rounded-[var(--radius-md)] bg-surface-container p-3">
            <p className="mb-2 md-label-large text-on-surface-variant">
              Pool Status
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="md-label-large text-on-surface">
                  Active: {stats.activePool}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-warning" />
                <span className="md-label-large text-on-surface">
                  Idle: {stats.idlePool}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
