"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

import { useToast } from "@/hooks/use-toast";
import { ApiError, wa, type BatchStartBody, type StartSessionBody } from "@/lib/api";
import type {
  Account,
  BannedAccount,
  BulkQueueStatus,
  ChatMessage,
  ChatPair,
  ExcelUploadResult,
  Log,
} from "@/types";

type ToastInput = Parameters<ReturnType<typeof useToast>["toast"]>[0];

export interface Warmer {
  connected: boolean;
  accounts: Account[];
  logs: Log[];
  chatPairs: ChatPair[];
  chatMessages: ChatMessage[];
  bannedAccounts: BannedAccount[];
  refetchAll: () => void;
  clearLogs: () => void;
  // actions
  startSession: (body: StartSessionBody) => Promise<boolean>;
  batchStart: (body: BatchStartBody) => Promise<boolean>;
  deleteAccount: (account: Account) => Promise<boolean>;
  rotatePools: () => void;
  retryConnection: (id: string) => void;
  clearBannedStatus: (id: string) => void;
  resetPersonality: (id: string) => void;
  uploadExcel: (file: File) => Promise<ExcelUploadResult | null>;
  startBulkProcessing: (count?: number) => Promise<boolean>;
  fetchBulkQueue: () => Promise<BulkQueueStatus | null>;
}

const WarmerContext = createContext<Warmer | null>(null);

export function useWarmer(): Warmer {
  const ctx = useContext(WarmerContext);
  if (!ctx) throw new Error("useWarmer must be used within <WarmerProvider>");
  return ctx;
}

export function WarmerProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [chatPairs, setChatPairs] = useState<ChatPair[]>([]);
  const [bannedAccounts, setBannedAccounts] = useState<BannedAccount[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------- data fetchers ---------- */
  const fetchAccounts = useCallback(async () => {
    try {
      setAccounts(await wa.getAccounts());
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const data = await wa.getLogs();
      setLogs(data.map((l) => ({ ...l, timestamp: new Date(l.timestamp) })));
    } catch {
      /* ignore */
    }
  }, []);

  const fetchChatPairs = useCallback(async () => {
    try {
      setChatPairs(await wa.getChatPairs());
    } catch {
      /* ignore */
    }
  }, []);

  const fetchBanned = useCallback(async () => {
    try {
      const data = await wa.getBanned();
      setBannedAccounts(data.accounts ?? []);
    } catch {
      /* ignore */
    }
  }, []);

  const refetchAll = useCallback(() => {
    fetchAccounts();
    fetchLogs();
    fetchChatPairs();
    fetchBanned();
  }, [fetchAccounts, fetchLogs, fetchChatPairs, fetchBanned]);

  /* ---------- socket ---------- */
  useEffect(() => {
    const socket = io(window.location.origin, {
      path: "/api/socket.io",
      transports: ["polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    const patch = (id: string, fields: Partial<Account>) =>
      setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...fields } : a)));

    socket.on("connect", () => setConnected(true));
    socket.on("connect_error", () => setConnected(false));
    socket.on("disconnect", () => setConnected(false));

    socket.on("init", (data: { accounts?: Account[]; logs?: Log[]; chatPairs?: ChatPair[] }) => {
      if (data.accounts) setAccounts(data.accounts);
      if (data.logs) setLogs(data.logs.map((l) => ({ ...l, timestamp: new Date(l.timestamp) })));
      if (data.chatPairs) setChatPairs(data.chatPairs);
    });
    socket.on("log", (log: Log) =>
      setLogs((prev) => [{ ...log, timestamp: new Date(log.timestamp) }, ...prev].slice(0, 500))
    );
    socket.on("account-status", ({ accountId, status }: { accountId: string; status: Account["status"] }) =>
      patch(accountId, { status })
    );
    socket.on("qr-code", ({ accountId, qr }: { accountId: string; qr: string }) =>
      patch(accountId, { qrCode: qr })
    );
    socket.on("pairing-code", ({ accountId, code }: { accountId: string; code: string }) =>
      patch(accountId, { pairingCode: code })
    );
    socket.on("account-info", (info: { accountId: string; phoneNumber?: string; name?: string; profilePicture?: string }) =>
      patch(info.accountId, { phoneNumber: info.phoneNumber, name: info.name, profilePicture: info.profilePicture })
    );
    socket.on("warming-stats", ({ accountId, stats }: { accountId: string; stats: Account["warmingStats"] }) =>
      patch(accountId, { warmingStats: stats })
    );
    socket.on("pool-change", ({ accountId, pool }: { accountId: string; pool: Account["pool"] }) =>
      patch(accountId, { pool })
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  /* ---------- initial load (deferred off the render path) ---------- */
  useEffect(() => {
    void Promise.resolve().then(refetchAll);
  }, [refetchAll]);

  /* ---------- fallback polling (only when socket is down) ---------- */
  useEffect(() => {
    pollingRef.current = setInterval(() => {
      if (!socketRef.current?.connected) {
        fetchAccounts();
        fetchLogs();
        fetchChatPairs();
      }
    }, 10000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchAccounts, fetchLogs, fetchChatPairs]);

  /* ---------- derived chat messages ---------- */
  const chatMessages = useMemo<ChatMessage[]>(
    () =>
      logs
        .filter((l) => l.type === "message" || l.type === "warming")
        .slice(0, 50)
        .map((l) => {
          const isOutgoing =
            l.message.includes("📤") ||
            l.message.includes("Auto-reply") ||
            l.message.includes("sent");
          return {
            id: l.id,
            accountId: l.message.match(/\[([^\]]+)\]/)?.[1] || "unknown",
            text: l.message.replace(/[📥📤💬⏳]/g, "").replace(/\[[^\]]+\]/, "").trim(),
            timestamp: l.timestamp,
            direction: isOutgoing ? "outgoing" : "incoming",
            isAutoResponse: l.message.includes("Auto-reply"),
          };
        }),
    [logs]
  );

  /* ---------- mutation helper ---------- */
  const run = useCallback(
    async (fn: () => Promise<unknown>, ok?: ToastInput, onOk?: () => void) => {
      try {
        await fn();
        if (ok) toast(ok);
        onOk?.();
        return true;
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : "Something went wrong";
        toast({ title: "Error", description: msg, variant: "destructive" });
        return false;
      }
    },
    [toast]
  );

  /* ---------- actions ---------- */
  const startSession = useCallback(
    (body: StartSessionBody) =>
      run(() => wa.startSession(body), { title: "Session Started", description: `Account ${body.accountId}` }, fetchAccounts),
    [run, fetchAccounts]
  );

  const batchStart = useCallback(
    (body: BatchStartBody) =>
      run(() => wa.batchStart(body), { title: "Bulk Queue Started", description: `${body.accountIds.length} accounts added to queue` }, fetchAccounts),
    [run, fetchAccounts]
  );

  const deleteAccount = useCallback(
    (account: Account) =>
      run(
        () => wa.deleteAccount(account.id),
        { title: "Account Deleted", description: `${account.personality?.name || account.id} has been removed` },
        fetchAccounts
      ),
    [run, fetchAccounts]
  );

  const rotatePools = useCallback(() => {
    run(() => wa.rotatePools(), { title: "Pool Rotation", description: "Rotating pools..." });
  }, [run]);

  const retryConnection = useCallback(
    (id: string) => {
      run(() => wa.retry(id), { title: "Retrying Connection", description: `Retrying connection for ${id}...` }, fetchAccounts);
    },
    [run, fetchAccounts]
  );

  const clearBannedStatus = useCallback(
    (id: string) => {
      run(() => wa.clearBan(id), { title: "Success", description: `Banned status cleared for ${id}` }, () => { fetchBanned(); fetchAccounts(); });
    },
    [run, fetchBanned, fetchAccounts]
  );

  const resetPersonality = useCallback(
    (id: string) => {
      run(() => wa.resetPersonality(id), { title: "Success", description: `Personality reset for ${id}` }, () => { fetchBanned(); fetchAccounts(); });
    },
    [run, fetchBanned, fetchAccounts]
  );

  const uploadExcel = useCallback(
    async (file: File): Promise<ExcelUploadResult | null> => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const data = await wa.bulkUpload(formData);
        toast({ title: "Excel Parsed", description: `${data.total} accounts found in file` });
        return data;
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : "Failed to parse Excel";
        toast({ title: "Error", description: msg, variant: "destructive" });
        return null;
      }
    },
    [toast]
  );

  const startBulkProcessing = useCallback(
    (count?: number) =>
      run(() => wa.bulkStart(), {
        title: "Processing Started",
        description: count ? `${count} accounts being processed` : "Accounts are being processed",
      }),
    [run]
  );

  const fetchBulkQueue = useCallback(async (): Promise<BulkQueueStatus | null> => {
    try {
      const { summary } = await wa.bulkQueue();
      return summary;
    } catch {
      return null;
    }
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  const value = useMemo<Warmer>(
    () => ({
      connected,
      accounts,
      logs,
      chatPairs,
      chatMessages,
      bannedAccounts,
      refetchAll,
      clearLogs,
      startSession,
      batchStart,
      deleteAccount,
      rotatePools,
      retryConnection,
      clearBannedStatus,
      resetPersonality,
      uploadExcel,
      startBulkProcessing,
      fetchBulkQueue,
    }),
    [
      connected, accounts, logs, chatPairs, chatMessages, bannedAccounts,
      refetchAll, clearLogs, startSession, batchStart, deleteAccount,
      rotatePools, retryConnection, clearBannedStatus, resetPersonality,
      uploadExcel, startBulkProcessing, fetchBulkQueue,
    ]
  );

  return <WarmerContext.Provider value={value}>{children}</WarmerContext.Provider>;
}
