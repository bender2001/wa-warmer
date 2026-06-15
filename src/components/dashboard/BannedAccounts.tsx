"use client";

import { AlertTriangle, CheckCircle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWarmer } from "@/hooks/useWarmer";
import { useUiStore } from "@/stores/ui-store";

export function BannedAccounts() {
  const { bannedAccounts, clearBannedStatus, resetPersonality } = useWarmer();
  const showBanned = useUiStore((s) => s.showBanned);
  const toggleBanned = useUiStore((s) => s.toggleBanned);

  if (bannedAccounts.length === 0) return null;

  return (
    <Card variant="outlined" className="border-danger/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base text-danger">
            <AlertTriangle className="h-5 w-5" />
            Banned Accounts ({bannedAccounts.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={toggleBanned}>
            {showBanned ? "Hide" : "Show"}
          </Button>
        </div>
      </CardHeader>
      {showBanned && (
        <CardContent>
          <div className="space-y-3">
            {bannedAccounts.map((banned) => (
              <div
                key={banned.id}
                className="flex items-center justify-between rounded-2xl bg-surface-container p-3"
              >
                <div>
                  <p className="text-sm font-medium text-on-surface">{banned.id}</p>
                  <p className="text-xs text-on-surface-variant">
                    Active: {banned.daysActive} days | Sent: {banned.messagesSent} | Received:{" "}
                    {banned.messagesReceived}
                  </p>
                  {banned.lastBanDate && (
                    <p className="text-xs text-danger">
                      Banned: {new Date(banned.lastBanDate).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outlined"
                    onClick={() => clearBannedStatus(banned.id)}
                    className="text-xs"
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Clear Ban
                  </Button>
                  <Button
                    size="sm"
                    variant="outlined"
                    onClick={() => resetPersonality(banned.id)}
                    className="text-xs"
                  >
                    <RotateCw className="mr-1 h-3 w-3" />
                    Reset
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
