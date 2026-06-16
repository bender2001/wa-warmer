"use client";

import { Wifi, WifiOff, MoreVertical, Eye, RotateCw, Trash2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { shapeMorph } from "@/lib/motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { IconButton } from "@/components/ui/icon-button";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useUiStore } from "@/stores/ui-store";
import { useWarmer } from "@/hooks/useWarmer";
import {
  poolColor,
  statusColor,
  healthColor,
  chronotypeInfo,
} from "@/lib/account-meta";
import { formatHour } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Account } from "@/types";

export function AccountCard({ account }: { account: Account }) {
  const openDetail = useUiStore((s) => s.openDetail);
  const openDelete = useUiStore((s) => s.openDelete);
  const openQr = useUiStore((s) => s.openQr);
  const { retryConnection } = useWarmer();
  const reduce = useReducedMotion();

  const online = account.status === "online";
  const connecting = account.status === "connecting";

  return (
    <motion.div
      variants={reduce ? undefined : shapeMorph}
      initial="rest"
      whileTap="press"
      className="rounded-[var(--radius-md)]"
    >
      <Card
        variant="elevated"
        className={cn(
          "group relative overflow-hidden",
          account.pool === "active" && online && "ring-2 ring-success",
          account.pool === "idle" && online && "ring-2 ring-warning"
        )}
      >
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-1",
            poolColor(account.pool)
          )}
        />

        <CardContent>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-surface md-elevation-1">
                <AvatarFallback className="bg-primary text-on-primary md-label-large-emphasized">
                  {account.personality?.name?.charAt(0) ||
                    account.id.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface",
                  statusColor(account.status)
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="md-title-small text-on-surface truncate">
                {account.personality?.name || account.name || account.id}
              </h3>
              <p className="md-body-small text-on-surface-variant truncate">
                {account.personality
                  ? `${account.personality.age}yo ${account.personality.occupation}`
                  : account.phoneNumber || "Not connected"}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {online ? (
                <Wifi className="h-4 w-4 text-success" />
              ) : connecting ? (
                <LoadingIndicator size={18} className="text-warning" />
              ) : (
                <WifiOff className="h-4 w-4 text-danger" />
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton variant="standard" size="sm" aria-label="Account options">
                    <MoreVertical className="h-4 w-4" />
                  </IconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openDetail(account)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {(connecting || account.status === "offline") && (
                    <DropdownMenuItem onClick={() => retryConnection(account.id)}>
                      <RotateCw className="h-4 w-4 mr-2" />
                      Retry Connection
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => openDelete(account)}
                    className="text-danger focus:text-danger"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {online && (
            <div className="mb-2 flex items-center gap-2 flex-wrap">
              <Badge
                variant={account.pool === "active" ? "success" : "warning"}
                className="md-label-small"
              >
                {account.pool === "active" ? "💬 Chatting" : "😴 Idle"}
              </Badge>
              {account.personality?.chronotype &&
                (() => {
                  const info = chronotypeInfo(account.personality.chronotype);
                  const Icon = info.icon;
                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className={cn("md-label-small", info.bg)}
                        >
                          <Icon className={cn("h-3 w-3", info.color)} />
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{info.label}</p>
                        <p className="md-body-small text-on-surface-variant">
                          {formatHour(account.personality.activeHoursStart || 0)} -{" "}
                          {formatHour(account.personality.activeHoursEnd || 0)}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })()}
              {account.isInActiveWindow === false && (
                <Badge variant="secondary" className="md-label-small">
                  🔴 Inactive
                </Badge>
              )}
            </div>
          )}

          {connecting && account.qrCode && (
            <button
              type="button"
              aria-label="Enlarge QR code"
              className="relative flex w-full flex-col items-center mb-3 p-2 bg-surface-container rounded-[var(--radius-md)] cursor-pointer state-layer-on-surface outline-none focus-visible:ring-[3px] focus-visible:ring-primary/40"
              onClick={() => openQr(account.qrCode!, account.id)}
            >
              <img
                src={account.qrCode}
                alt="QR Code"
                className="w-32 h-32 rounded-[var(--radius-sm)] md-elevation-1 group-hover:scale-105 transition-transform"
              />
              <p className="md-label-small text-on-surface-variant mt-1">
                Click to enlarge
              </p>
            </button>
          )}

          {connecting && account.pairingCode && (
            <div className="flex flex-col items-center mb-3 p-2 bg-surface-container rounded-[var(--radius-md)]">
              <p className="md-title-medium font-mono text-on-surface">
                {account.pairingCode}
              </p>
            </div>
          )}

          {online && account.warmingStats && (
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="md-label-small text-on-surface-variant">Health</span>
                <span
                  className={cn(
                    "md-label-small-emphasized tabular-nums",
                    healthColor(account.warmingStats.healthScore)
                  )}
                >
                  {account.warmingStats.healthScore}%
                </span>
              </div>
              <Progress value={account.warmingStats.healthScore} className="h-1" />
            </div>
          )}

          {account.rateLimit && (
            <div className="flex items-center justify-between md-label-small text-on-surface-variant tabular-nums">
              <span>
                Rate: {account.rateLimit.hour}/{account.rateLimit.maxHour}h
              </span>
              <span>
                {account.rateLimit.day}/{account.rateLimit.maxDay}d
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
