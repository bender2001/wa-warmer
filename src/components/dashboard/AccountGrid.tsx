"use client";

import { Users, Plus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { spatial, listItem } from "@/lib/motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/ui-store";
import { AccountCard } from "@/components/dashboard/AccountCard";
import type { Account } from "@/types";

export function AccountGrid({ accounts }: { accounts: Account[] }) {
  const setAddOpen = useUiStore((s) => s.setAddOpen);
  const reduceMotion = useReducedMotion();

  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 grid size-16 place-items-center rounded-[var(--radius-md)] bg-secondary-container text-on-secondary-container">
              <Users className="size-8" />
            </div>
            <h3 className="md-title-medium text-on-surface mb-1">No Accounts</h3>
            <p className="md-body-medium text-on-surface-variant mb-4">
              Add a WhatsApp account to start warming.
            </p>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="size-[18px] mr-2" />
              Add Account
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {accounts.map((account, i) => (
        <motion.div
          key={account.id}
          variants={listItem}
          initial={reduceMotion ? false : "initial"}
          animate="animate"
          transition={{ ...spatial.default, delay: reduceMotion ? 0 : i * 0.04 }}
        >
          <AccountCard account={account} />
        </motion.div>
      ))}
    </div>
  );
}
