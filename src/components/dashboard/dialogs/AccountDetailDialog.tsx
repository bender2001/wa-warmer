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

export function AccountDetailDialog() {
  const detail = useUiStore((s) => s.detail);
  const closeDetail = useUiStore((s) => s.closeDetail);
  const openDelete = useUiStore((s) => s.openDelete);

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
                <AvatarFallback className="bg-primary text-on-primary font-bold text-xl">
                  {detail.personality?.name?.charAt(0) || detail.id.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-on-surface">
                  {detail.personality?.name || detail.name || detail.id}
                </h3>
                <p className="text-sm text-on-surface-variant">
                  {detail.phoneNumber || "Not connected"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn("w-2 h-2 rounded-full", statusColor(detail.status))} />
                  <span className="text-xs capitalize text-on-surface-variant">{detail.status}</span>
                  {detail.pool && (
                    <Badge
                      variant={detail.pool === "active" ? "success" : detail.pool === "idle" ? "warning" : "secondary"}
                      className="ml-2 text-[10px] capitalize"
                    >
                      {detail.pool}
                    </Badge>
                  )}
                  {detail.isInActiveWindow !== undefined && (
                    <Badge variant={detail.isInActiveWindow ? "success" : "secondary"} className="text-[10px]">
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
                      <div className={cn("p-3 rounded-2xl", info.bg)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={cn("h-5 w-5", info.color)} />
                            <span className="text-sm font-medium text-on-surface">{info.label}</span>
                          </div>
                          <span className="text-xs text-on-surface-variant">{info.desc}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-on-surface-variant">
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
                  <div className="p-3 rounded-2xl bg-surface-container">
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-1">
                      <User className="h-3.5 w-3.5" />
                      Age
                    </div>
                    <p className="text-sm font-medium text-on-surface">
                      {detail.personality.age} years old
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-surface-container">
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      Occupation
                    </div>
                    <p className="text-sm font-medium text-on-surface">{detail.personality.occupation}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-surface-container col-span-2">
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-1">
                      <MapPin className="h-3.5 w-3.5" />
                      Location
                    </div>
                    <p className="text-sm font-medium text-on-surface">{detail.personality.location}</p>
                  </div>
                </div>

                {/* Traits */}
                {detail.personality.traits && detail.personality.traits.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
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
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
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
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Communication Style
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-2xl bg-surface-container text-center">
                      <p className="text-[10px] text-on-surface-variant mb-1">Emoji</p>
                      <p className="text-xs font-medium text-on-surface">
                        {emojiUsageLabel(detail.personality.emojiUsage).label}
                      </p>
                      <p className="text-xs mt-1">
                        {emojiUsageLabel(detail.personality.emojiUsage).emoji}
                      </p>
                    </div>
                    <div className="p-2 rounded-2xl bg-surface-container text-center">
                      <p className="text-[10px] text-on-surface-variant mb-1">Msg Length</p>
                      <p className="text-xs font-medium text-on-surface">
                        {messageLengthLabel(detail.personality.avgMessageLength)}
                      </p>
                    </div>
                    <div className="p-2 rounded-2xl bg-surface-container text-center">
                      <p className="text-[10px] text-on-surface-variant mb-1">Avg Response</p>
                      <p className="text-xs font-medium text-on-surface">
                        {detail.personality.avgResponseTime || "?"} min
                      </p>
                    </div>
                  </div>

                  {/* Writing Style */}
                  {detail.personality.writingStyle && (
                    <div className="p-3 rounded-2xl bg-tertiary-container">
                      <p className="text-[10px] text-on-tertiary-container mb-1">Writing Style</p>
                      <p className="text-xs text-on-tertiary-container">{detail.personality.writingStyle}</p>
                    </div>
                  )}

                  {/* Response Style */}
                  {detail.personality.responseStyle && (
                    <div className="p-3 rounded-2xl bg-secondary-container">
                      <p className="text-[10px] text-on-secondary-container mb-1">Response Style</p>
                      <p className="text-xs text-on-secondary-container">{detail.personality.responseStyle}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator />

            {/* Warming Statistics */}
            {detail.warmingStats && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-on-surface flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Warming Statistics
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-2xl bg-success-container text-center">
                    <p className="text-[10px] text-on-success-container mb-1">Sent</p>
                    <p className="text-lg font-bold text-on-success-container">
                      {detail.warmingStats.messagesSent}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-secondary-container text-center">
                    <p className="text-[10px] text-on-secondary-container mb-1">Received</p>
                    <p className="text-lg font-bold text-on-secondary-container">
                      {detail.warmingStats.messagesReceived}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-tertiary-container text-center">
                    <p className="text-[10px] text-on-tertiary-container mb-1">Auto Reply</p>
                    <p className="text-lg font-bold text-on-tertiary-container">
                      {detail.warmingStats.autoResponsesSent}
                    </p>
                  </div>
                </div>

                {/* Health Score */}
                <div className="p-3 rounded-2xl bg-surface-container">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-on-surface-variant">Health Score</span>
                    <span className={cn("text-sm font-bold", healthColor(detail.warmingStats.healthScore))}>
                      {detail.warmingStats.healthScore}%
                    </span>
                  </div>
                  <Progress value={detail.warmingStats.healthScore} className="h-2" />
                </div>
              </div>
            )}

            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => {
                const account = detail;
                closeDetail();
                openDelete(account);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
