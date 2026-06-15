import { LayoutDashboard, Users, MessageCircle, Settings, type LucideIcon } from "lucide-react";

export type NavItem = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export const NAV: NavItem[] = [
  { value: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { value: "accounts", label: "Accounts", icon: Users },
  { value: "chatlog", label: "Chat Log", icon: MessageCircle },
  { value: "settings", label: "Settings", icon: Settings },
];
