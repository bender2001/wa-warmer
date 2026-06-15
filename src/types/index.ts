export interface RateLimit {
  hour: number;
  day: number;
  maxHour: number;
  maxDay: number;
}

export interface Personality {
  name: string;
  age: number;
  occupation: string;
  location: string;
  traits?: string[];
  hobbies?: string[];
  writingStyle?: string;
  responseStyle?: string;
  chronotype?: "early_bird" | "night_owl" | "regular" | "flexible";
  activeHoursStart?: number;
  activeHoursEnd?: number;
  peakHours?: number[];
  avgResponseTime?: number;
  emojiUsage?: "heavy" | "moderate" | "minimal";
  avgMessageLength?: "short" | "medium" | "long";
}

export interface WarmingStats {
  healthScore: number;
  messagesSent: number;
  messagesReceived: number;
  autoResponsesSent: number;
  warmingStartTime?: Date;
  lastActivity?: Date;
}

export interface Account {
  id: string;
  phoneNumber?: string;
  name?: string;
  profilePicture?: string;
  status: "online" | "offline" | "connecting";
  qrCode?: string;
  pairingCode?: string;
  warmingEnabled: boolean;
  warmingStats?: WarmingStats;
  personality?: Personality | null;
  pool?: "active" | "idle" | "offline";
  rateLimit?: RateLimit;
  warmingPhase?: number;
  warmingDays?: number;
  isInActiveWindow?: boolean;
}

export interface BannedAccount {
  id: string;
  daysActive: number;
  messagesSent: number;
  messagesReceived: number;
  banCount: number;
  lastBanDate?: string;
  replacement?: string;
}

export interface Log {
  id: string;
  type: "message" | "connection" | "error" | "info" | "warming" | "pool";
  message: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  accountId: string;
  text: string;
  timestamp: Date;
  direction: "incoming" | "outgoing";
  isAutoResponse?: boolean;
}

export interface ChatPair {
  id: string;
  account1: { id: string; name: string };
  account2: { id: string; name: string };
  currentTopic: string;
  topicCategory: string;
  messageCount: number;
  relationshipStage: string;
  relationshipLabel: string;
  sharedInterests: string[];
  topicsDiscussed: string[];
  startedAt: string;
  lastMessageAt?: string;
  silenceCount: number;
  maxSilenceCount: number;
  lastRespondedAt?: string;
}

export interface AiSettings {
  provider: string;
  groqApiKey: string;
  groqModel: string;
  hasGroqKey: boolean;
  lastUpdated?: string;
}

export interface AiTestResult {
  success: boolean;
  response?: string;
  error?: string;
}

export interface BulkQueueStatus {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  isProcessing: boolean;
}

export interface ExcelUploadResult {
  total: number;
  accounts: Array<{
    accountId: string;
    phoneNumber?: string;
    usePairingCode: boolean;
  }>;
}

export type AddMode = "single" | "bulk" | "excel";
export type AuthMethod = "qr" | "pairing";
export type PoolView = "all" | "active" | "idle" | "offline";

export interface Stats {
  totalAccounts: number;
  onlineAccounts: number;
  warmingAccounts: number;
  activePool: number;
  idlePool: number;
  totalMessages: number;
  avgHealth: number;
}
