"use client";

import {
  Briefcase,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Sparkles,
  Trash2,
  TrendingUp,
  User,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useUiStore } from "@/stores/ui-store";
import {
  chronotypeInfo,
  emojiUsageLabel,
  healthColor,
  messageLengthLabel,
  statusColor,
} from "@/lib/account-meta";
import { formatHour } from "@/lib/format";
import { cn } from "@/lib/utils";
import { spatial } from "@/lib/motion";

export function AccountDetailDialog() {
  const detail = useUiStore((s) => s.detail);
  const closeDetail = useUiStore((s) => s.closeDetail);
  const openDelete = useUiStore((s) => s.openDelete);
  const reduce = useReducedMotion();

  const tile = (extra?: string) =>
    cn("rounded-[var(--radius-md)] bg-surface-container p-3", extra);

  return (
    <Dialog open={!!detail} onOpenChange={(o) => !o && closeDetail()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Account Details</DialogTitle>
        </DialogHeader>
        {detail && (
          <div className="space-y-4 py-4">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-on-primary md-title-large">
                  {detail.personality?.name?.charAt(0) || detail.id.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="md-title-medium text-on-surface">
                  {detail.personality?.name || detail.name || detail.id}
                </h3>
                <p className="md-body-medium text-on-surface-variant">
                  {detail.phoneNumber || "Not connected"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn("w-2 h-2 rounded-full", statusColor(detail.status))} />
                  <span className="md-label-small capitalize text-on-surface-variant">{detail.status}</span>
                  {detail.pool && (
                    <Badge
                      variant={detail.pool === "active" ? "success" : detail.pool === "idle" ? "warning" : "secondary"}
                      className="ml-2 capitalize"
                    >
                      {detail.pool}
                    </Badge>
                  )}
                  {detail.isInActiveWindow !== undefined && (
                    <Badge variant={detail.isInActiveWindow ? "success" : "secondary"}>
                      {detail.isInActiveWindow ? "Active Window" : "Inactive"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Full Personality Details */}
            {detail.personality && (
              <div className="space-y-4">
                {/* Chronotype Panel */}
                {detail.personality.chronotype &&
                  (() => {
                    const info = chronotypeInfo(detail.personality.chronotype);
                    const Icon = info.icon;
                    return (
                      <div className={cn("p-3 rounded-[var(--radius-md)]", info.bg)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={cn("h-5 w-5", info.color)} />
                            <span className="md-title-small text-on-surface">{info.label}</span>
                          </div>
                          <span className="md-label-small text-on-surface-variant">{info.desc}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 md-label-medium text-on-surface-variant">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            Active: {formatHour(detail.personality.activeHoursStart || 0)} -{" "}
                            {formatHour(detail.personality.activeHoursEnd || 0)}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={tile()}>
                    <div className="flex items-center gap-2 md-label-medium text-on-surface-variant mb-1">
                      <User className="h-3.5 w-3.5" />
                      Age
                    </div>
                    <p className="md-body-medium text-on-surface">
                      {detail.personality.age} years old
                    </p>
                  </div>
                  <div className={tile()}>
                    <div className="flex items-center gap-2 md-label-medium text-on-surface-variant mb-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      Occupation
                    </div>
                    <p className="md-body-medium text-on-surface">{detail.personality.occupation}</p>
                  </div>
                  <div className={tile("col-span-2")}>
                    <div className="flex items-center gap-2 md-label-medium text-on-surface-variant mb-1">
                      <MapPin className="h-3.5 w-3.5" />
                      Location
                    </div>
                    <p className="md-body-medium text-on-surface">{detail.personality.location}</p>
                  </div>
                </div>

                {/* Traits */}
                {detail.personality.traits && detail.personality.traits.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 md-label-medium text-on-surface-variant mb-2">
                      <Sparkles className="h-3.5 w-3.5" />
                      Traits
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {detail.personality.traits.map((trait, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="bg-primary-container text-on-primary-container border-transparent"
                        >
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hobbies */}
                {detail.personality.hobbies && detail.personality.hobbies.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 md-label-medium text-on-surface-variant mb-2">
                      <Heart className="h-3.5 w-3.5" />
                      Hobbies
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {detail.personality.hobbies.map((hobby, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="bg-tertiary-container text-on-tertiary-container border-transparent"
                        >
                          {hobby}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Communication Style */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 md-title-small text-on-surface">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Communication Style
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className={tile("text-center")}>
                      <p className="md-label-small text-on-surface-variant mb-1">Emoji</p>
                      <p className="md-body-medium text-on-surface">
                        {emojiUsageLabel(detail.personality.emojiUsage).label}
                      </p>
                      <p className="md-body-medium mt-1">
                        {emojiUsageLabel(detail.personality.emojiUsage).emoji}
                      </p>
                    </div>
                    <div className={tile("text-center")}>
                      <p className="md-label-small text-on-surface-variant mb-1">Msg Length</p>
                      <p className="md-body-medium text-on-surface">
                        {messageLengthLabel(detail.personality.avgMessageLength)}
                      </p>
                    </div>
                    <div className={tile("text-center")}>
                      <p className="md-label-small text-on-surface-variant mb-1">Avg Response</p>
                      <p className="md-body-medium text-on-surface tabular-nums">
                        {detail.personality.avgResponseTime || "?"} min
                      </p>
                    </div>
                  </div>

                  {/* Writing Style */}
                  {detail.personality.writingStyle && (
                    <div className="p-3 rounded-[var(--radius-md)] bg-tertiary-container">
                      <p className="md-label-small text-on-tertiary-container mb-1">Writing Style</p>
                      <p className="md-body-medium text-on-tertiary-container">{detail.personality.writingStyle}</p>
                    </div>
                  )}

                  {/* Response Style */}
                  {detail.personality.responseStyle && (
                    <div className="p-3 rounded-[var(--radius-md)] bg-secondary-container">
                      <p className="md-label-small text-on-secondary-container mb-1">Response Style</p>
                      <p className="md-body-medium text-on-secondary-container">{detail.personality.responseStyle}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator />

            {/* Warming Statistics */}
            {detail.warmingStats && (
              <div className="space-y-3">
                <h4 className="md-title-small text-on-surface flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Warming Statistics
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-[var(--radius-md)] bg-success-container text-center">
                    <p className="md-label-small text-on-success-container mb-1">Sent</p>
                    <p className="md-title-medium text-on-success-container tabular-nums">
                      {detail.warmingStats.messagesSent}
                    </p>
                  </div>
                  <div className="p-3 rounded-[var(--radius-md)] bg-secondary-container text-center">
                    <p className="md-label-small text-on-secondary-container mb-1">Received</p>
                    <p className="md-title-medium text-on-secondary-container tabular-nums">
                      {detail.warmingStats.messagesReceived}
                    </p>
                  </div>
                  <div className="p-3 rounded-[var(--radius-md)] bg-tertiary-container text-center">
                    <p className="md-label-small text-on-tertiary-container mb-1">Auto Reply</p>
                    <p className="md-title-medium text-on-tertiary-container tabular-nums">
                      {detail.warmingStats.autoResponsesSent}
                    </p>
                  </div>
                </div>

                {/* Health Score */}
                <div className={tile()}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="md-label-medium text-on-surface-variant">Health Score</span>
                    <span className={cn("md-title-small-emphasized tabular-nums", healthColor(detail.warmingStats.healthScore))}>
                      {detail.warmingStats.healthScore}%
                    </span>
                  </div>
                  <Progress value={detail.warmingStats.healthScore} className="h-2" />
                </div>
              </div>
            )}

            <Button asChild variant="destructive" size="sm" className="w-full">
              <motion.button
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={spatial.fast}
                onClick={() => {
                  const account = detail;
                  closeDetail();
                  openDelete(account);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </motion.button>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
