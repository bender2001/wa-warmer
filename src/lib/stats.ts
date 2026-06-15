import type { Account, PoolView, Stats } from "@/types";

export function computeStats(accounts: Account[]): Stats {
  return {
    totalAccounts: accounts.length,
    onlineAccounts: accounts.filter((a) => a.status === "online").length,
    warmingAccounts: accounts.filter((a) => a.warmingEnabled && a.status === "online").length,
    activePool: accounts.filter((a) => a.pool === "active").length,
    idlePool: accounts.filter((a) => a.pool === "idle").length,
    totalMessages: accounts.reduce(
      (sum, a) =>
        sum + (a.warmingStats?.messagesSent || 0) + (a.warmingStats?.messagesReceived || 0),
      0
    ),
    avgHealth: accounts.length
      ? Math.round(
          accounts.reduce((sum, a) => sum + (a.warmingStats?.healthScore || 0), 0) /
            accounts.length
        )
      : 0,
  };
}

export function filterAccounts(accounts: Account[], view: PoolView): Account[] {
  if (view === "all") return accounts;
  if (view === "offline") return accounts.filter((a) => a.pool === "offline" || !a.pool);
  return accounts.filter((a) => a.pool === view);
}
