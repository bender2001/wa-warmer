"use client";

import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useReducedMotion } from "framer-motion";
import { listItem } from "@/lib/motion";
import type { ChatPair } from "@/types";

export function ChatPairsPanel({ chatPairs }: { chatPairs: ChatPair[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="md-title-medium flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Active Chat Pairs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {chatPairs.length === 0 ? (
            <div className="col-span-full text-center py-8 text-on-surface-variant">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="md-body-medium">No active chat pairs</p>
            </div>
          ) : (
            chatPairs.slice(0, 6).map((pair) => (
              <motion.div
                key={pair.id}
                variants={reduceMotion ? undefined : listItem}
                initial={reduceMotion ? false : "initial"}
                animate={reduceMotion ? false : "animate"}
                whileHover={reduceMotion ? undefined : { scale: 1.01, y: -2 }}
                className="p-3 rounded-[var(--radius-md)] bg-surface-container border border-outline-variant"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <span className="md-title-small text-on-surface">{pair.account1.name}</span>
                    <span className="text-on-surface-variant">↔</span>
                    <span className="md-title-small text-on-surface">{pair.account2.name}</span>
                  </div>
                  <Badge variant="assist">
                    {pair.messageCount} msg
                  </Badge>
                </div>
                <div className="md-body-small text-on-surface-variant mb-2">
                  💬 "{pair.currentTopic}"
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">
                    {pair.relationshipLabel}
                  </Badge>
                  {pair.sharedInterests.length > 0 && (
                    <Badge variant="assist">
                      ❤️ {pair.sharedInterests[0]}
                    </Badge>
                  )}
                  {pair.silenceCount > 0 && (
                    <Badge variant="warning">
                      🔇 {pair.silenceCount}/{pair.maxSilenceCount} silence
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
