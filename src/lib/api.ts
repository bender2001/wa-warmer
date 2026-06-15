import type {
  Account,
  AiSettings,
  AiTestResult,
  BannedAccount,
  ChatPair,
  ExcelUploadResult,
  Log,
} from "@/types";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`/api/wa/${path}`, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      (data as { error?: string })?.error ?? `Request failed (${res.status})`,
      res.status
    );
  }
  return data as T;
}

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export interface StartSessionBody {
  accountId: string;
  usePairingCode: boolean;
  phoneNumber?: string;
}

export interface BatchStartBody {
  accountIds: string[];
  usePairingCodes: boolean[];
  phoneNumbers?: string[];
}

/** Typed client over the `/api/wa/*` proxy. */
export const wa = {
  getAccounts: () => request<Account[]>("accounts"),
  getLogs: () => request<Log[]>("logs"),
  getChatPairs: () => request<ChatPair[]>("chat-pairs"),
  getBanned: () => request<{ accounts: BannedAccount[] }>("burnable/banned"),

  clearBan: (id: string) => request(`banned/clear/${id}`, { method: "POST" }),
  resetPersonality: (id: string) =>
    request(`personality/reset/${id}`, { method: "POST" }),

  getAiSettings: () => request<Partial<AiSettings>>("ai-settings"),
  saveAiSettings: (body: Pick<AiSettings, "provider" | "groqApiKey" | "groqModel">) =>
    request("ai-settings", json("POST", body)),
  testAi: () =>
    request<AiTestResult & { provider?: string }>("ai-settings/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }),

  startSession: (body: StartSessionBody) =>
    request("session/start", json("POST", body)),
  batchStart: (body: BatchStartBody) =>
    request("session/batch-start", json("POST", body)),
  deleteAccount: (id: string) =>
    request(`account/${id}`, { method: "DELETE" }),
  rotatePools: () => request("pool/rotate", { method: "POST" }),
  retry: (id: string) => request(`session/retry/${id}`, json("POST", {})),

  bulkUpload: (formData: FormData) =>
    request<ExcelUploadResult>("bulk/upload", { method: "POST", body: formData }),
  bulkStart: () => request("bulk/start", { method: "POST" }),
  bulkQueue: () =>
    request<{
      summary: {
        total: number;
        completed: number;
        pending: number;
        failed: number;
        isProcessing: boolean;
      };
    }>("bulk/queue"),

  templateUrl: "/api/wa/bulk/template",
};
