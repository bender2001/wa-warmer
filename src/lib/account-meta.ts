import {
  Activity,
  Clock,
  Flame,
  type LucideIcon,
  MessageCircle,
  Moon,
  Sun,
  Users,
  Zap,
} from "lucide-react";
import type { Log, Personality, Stats } from "@/types";

/* ---------- M3 accent roles (icon chips, etc.) ---------- */
export type Accent =
  | "primary"
  | "secondary"
  | "tertiary"
  | "success"
  | "warning"
  | "danger";

export const ACCENT: Record<Accent, string> = {
  primary: "bg-primary-container text-on-primary-container",
  secondary: "bg-secondary-container text-on-secondary-container",
  tertiary: "bg-tertiary-container text-on-tertiary-container",
  success: "bg-success-container text-on-success-container",
  warning: "bg-warning-container text-on-warning-container",
  danger: "bg-danger-container text-on-danger-container",
};

/* ---------- Dashboard stat tiles (collapses 6 duplicated cards) ---------- */
export interface StatDef {
  key: string;
  label: string;
  icon: LucideIcon;
  accent: Accent;
  value: (s: Stats) => number | string;
  sub?: (s: Stats) => string;
}

export const STATS: StatDef[] = [
  {
    key: "accounts",
    label: "Accounts",
    icon: Users,
    accent: "primary",
    value: (s) => s.onlineAccounts,
    sub: (s) => `/${s.totalAccounts}`,
  },
  { key: "warming", label: "Warming", icon: Flame, accent: "warning", value: (s) => s.warmingAccounts },
  { key: "active", label: "Active Pool", icon: Zap, accent: "success", value: (s) => s.activePool },
  { key: "idle", label: "Idle Pool", icon: Moon, accent: "secondary", value: (s) => s.idlePool },
  { key: "messages", label: "Messages", icon: MessageCircle, accent: "tertiary", value: (s) => s.totalMessages },
  { key: "health", label: "Avg Health", icon: Activity, accent: "primary", value: (s) => `${s.avgHealth}%` },
];

/* ---------- Status / pool color lookups (M3 status roles) ---------- */
const STATUS_COLOR: Record<string, string> = {
  online: "bg-success",
  offline: "bg-danger",
  connecting: "bg-warning",
};
export const statusColor = (s: string) => STATUS_COLOR[s] ?? "bg-outline";

const POOL_COLOR: Record<string, string> = {
  active: "bg-success",
  idle: "bg-warning",
};
export const poolColor = (p?: string) => POOL_COLOR[p ?? ""] ?? "bg-outline";

const LOG_COLOR: Record<Log["type"], string> = {
  message: "text-success",
  connection: "text-primary",
  error: "text-danger",
  warming: "text-warning",
  info: "text-on-surface-variant",
  pool: "text-on-surface-variant",
};
export const logColor = (t: Log["type"]) =>
  LOG_COLOR[t] ?? "text-on-surface-variant";

export const healthColor = (n: number) =>
  n >= 80 ? "text-success" : n >= 50 ? "text-warning" : "text-danger";

/* ---------- Chronotype (English) ---------- */
export interface ChronotypeInfo {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  desc: string;
}

const CHRONOTYPE: Record<
  NonNullable<Personality["chronotype"]>,
  ChronotypeInfo
> = {
  early_bird: { label: "Early Bird", icon: Sun, color: "text-warning", bg: "bg-warning-container", desc: "Active mornings, sleeps at night" },
  night_owl: { label: "Night Owl", icon: Moon, color: "text-tertiary", bg: "bg-tertiary-container", desc: "Wakes late, active at night" },
  regular: { label: "Regular", icon: Clock, color: "text-primary", bg: "bg-primary-container", desc: "Regular schedule" },
  flexible: { label: "Flexible", icon: Zap, color: "text-success", bg: "bg-success-container", desc: "Flexible, anytime" },
};

export const chronotypeInfo = (c?: Personality["chronotype"]): ChronotypeInfo =>
  (c && CHRONOTYPE[c]) || {
    label: "Unknown",
    icon: Clock,
    color: "text-on-surface-variant",
    bg: "bg-surface-container-high",
    desc: "",
  };

/* ---------- Communication style labels (English) ---------- */
const EMOJI_USAGE: Record<
  NonNullable<Personality["emojiUsage"]>,
  { label: string; emoji: string }
> = {
  heavy: { label: "Lots of Emoji", emoji: "😊🎉👍" },
  moderate: { label: "Moderate", emoji: "😊👍" },
  minimal: { label: "Minimal", emoji: "👍" },
};
export const emojiUsageLabel = (u?: Personality["emojiUsage"]) =>
  (u && EMOJI_USAGE[u]) || { label: "Normal", emoji: "" };

const MSG_LENGTH: Record<NonNullable<Personality["avgMessageLength"]>, string> = {
  short: "Short",
  medium: "Medium",
  long: "Long",
};
export const messageLengthLabel = (l?: Personality["avgMessageLength"]) =>
  (l && MSG_LENGTH[l]) || "Normal";

/* ---------- Groq models ---------- */
export const GROQ_MODELS = [
  { value: "llama-3.3-70b-versatile", label: "Llama 3.3 70B (Recommended)" },
  { value: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant (Fast)" },
  { value: "llama-3.2-3b-preview", label: "Llama 3.2 3B (Fastest)" },
  { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B" },
];
