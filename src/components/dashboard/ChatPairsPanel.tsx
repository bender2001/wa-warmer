"use client";

import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ChatPair } from "@/types";

export function ChatPairsPanel({ chatPairs }: { chatPairs: ChatPair[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Active Chat Pairs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {chatPairs.length === 0 ? (
            <div className="col-span-full text-center py-8 text-on-surface-variant">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No active chat pairs</p>
            </div>
          ) : (
            chatPairs.slice(0, 6).map((pair) => (
              <div
                key={pair.id}
                className="p-3 rounded-2xl bg-surface-container border border-outline-variant"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-on-surface">{pair.account1.name}</span>
                    <span className="text-on-surface-variant">↔</span>
                    <span className="text-sm font-medium text-on-surface">{pair.account2.name}</span>
                  </div>
                  <Badge variant="assist" className="text-[10px]">
                    {pair.messageCount} msg
                  </Badge>
                </div>
                <div className="text-xs text-on-surface-variant mb-2">
                  💬 "{pair.currentTopic}"
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-[10px]">
                    {pair.relationshipLabel}
                  </Badge>
                  {pair.sharedInterests.length > 0 && (
                    <Badge variant="assist" className="text-[10px]">
                      ❤️ {pair.sharedInterests[0]}
                    </Badge>
                  )}
                  {pair.silenceCount > 0 && (
                    <Badge variant="warning" className="text-[10px]">
                      🔇 {pair.silenceCount}/{pair.maxSilenceCount} silence
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
