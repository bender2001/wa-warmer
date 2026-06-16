"use client";

import { AlertTriangle, CheckCircle, RotateCw } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listItem, spatial } from "@/lib/motion";
import { useWarmer } from "@/hooks/useWarmer";
import { useUiStore } from "@/stores/ui-store";

export function BannedAccounts() {
  const { bannedAccounts, clearBannedStatus, resetPersonality } = useWarmer();
  const showBanned = useUiStore((s) => s.showBanned);
  const toggleBanned = useUiStore((s) => s.toggleBanned);
  const reduceMotion = useReducedMotion();

  if (bannedAccounts.length === 0) return null;

  return (
    <Card variant="outlined" className="border-danger/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="md-title-medium flex items-center gap-2 text-danger">
            <AlertTriangle className="h-5 w-5" />
            Banned Accounts ({bannedAccounts.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={toggleBanned}>
            {showBanned ? "Hide" : "Show"}
          </Button>
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        {showBanned && (
          <motion.div
            key="banned-list"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={spatial.default}
            className="overflow-hidden"
          >
            <CardContent>
              <div className="space-y-3">
                {bannedAccounts.map((banned) => (
                  <motion.div
                    key={banned.id}
                    variants={listItem}
                    initial="initial"
                    animate="animate"
                    whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                    transition={spatial.fast}
                    className="flex items-center justify-between rounded-[var(--radius-md)] bg-surface-container p-3"
                  >
                    <div>
                      <p className="md-body-medium text-on-surface">{banned.id}</p>
                      <p className="md-body-small text-on-surface-variant">
                        Active: {banned.daysActive} days | Sent: {banned.messagesSent} | Received:{" "}
                        {banned.messagesReceived}
                      </p>
                      {banned.lastBanDate && (
                        <p className="md-body-small text-danger">
                          Banned: {new Date(banned.lastBanDate).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outlined"
                        onClick={() => clearBannedStatus(banned.id)}
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Clear Ban
                      </Button>
                      <Button
                        size="sm"
                        variant="outlined"
                        onClick={() => resetPersonality(banned.id)}
                      >
                        <RotateCw className="mr-1 h-3 w-3" />
                        Reset
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
