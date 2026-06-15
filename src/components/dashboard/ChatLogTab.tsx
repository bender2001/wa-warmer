"use client";

import { ArrowDownLeft, ArrowUpRight, Bot, Inbox, LogOut, MessageCircle, Trash2 } from "lucide-react";

import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWarmer } from "@/hooks/useWarmer";
import { cn } from "@/lib/utils";

export function ChatLogTab() {
  const { chatMessages, logs, clearLogs } = useWarmer();

  const incoming = chatMessages.filter((m) => m.direction === "incoming").length;
  const outgoing = chatMessages.filter((m) => m.direction === "outgoing").length;
  const auto = chatMessages.filter((m) => m.isAutoResponse).length;

  const summary = [
    { label: "Incoming", icon: Inbox, accent: "text-success", value: incoming },
    { label: "Outgoing", icon: LogOut, accent: "text-primary", value: outgoing },
    { label: "Auto Replies", icon: Bot, accent: "text-tertiary", value: auto },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-on-surface">Chat Log</h2>
          <p className="text-sm text-on-surface-variant">All message activity</p>
        </div>
        <Button variant="outlined" size="sm" onClick={clearLogs}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              {chatMessages.length > 0 ? (
                <div className="space-y-3">
                  {chatMessages.map((msg) => {
                    const out = msg.direction === "outgoing";
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex gap-3 p-3 rounded-2xl",
                          out ? "bg-surface-container ml-8" : "bg-success-container/40 mr-8"
                        )}
                      >
                        <div
                          className={cn(
                            "p-2 rounded-full shrink-0",
                            out ? "bg-primary-container" : "bg-success-container"
                          )}
                        >
                          {out ? (
                            <ArrowUpRight className="h-4 w-4 text-on-primary-container" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4 text-on-success-container" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-on-surface">{msg.accountId}</span>
                            {msg.isAutoResponse && (
                              <Badge variant="secondary" className="text-[10px]">
                                <Bot className="h-2.5 w-2.5 mr-1" />
                                Auto
                              </Badge>
                            )}
                            <span className="text-[10px] text-on-surface-variant ml-auto">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-on-surface-variant break-words">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <MessageCircle className="h-12 w-12 text-on-surface-variant/40 mb-4" />
                  <p className="text-sm text-on-surface-variant">No messages yet</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary.map(({ label, icon: Icon, accent, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={cn("h-4 w-4", accent)} />
                      <span className="text-sm text-on-surface-variant">{label}</span>
                    </div>
                    <span className="font-semibold text-on-surface tabular-nums">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed logs={logs} limit={50} height="h-72" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
