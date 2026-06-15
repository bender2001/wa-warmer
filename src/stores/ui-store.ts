import { create } from "zustand";
import type { Account, PoolView } from "@/types";

interface QrState {
  open: boolean;
  qrCode: string;
  accountId: string;
}

interface UiStore {
  activeTab: string;
  setActiveTab: (t: string) => void;

  poolView: PoolView;
  setPoolView: (p: PoolView) => void;

  showBanned: boolean;
  toggleBanned: () => void;

  addOpen: boolean;
  setAddOpen: (b: boolean) => void;

  detail: Account | null;
  openDetail: (a: Account) => void;
  closeDetail: () => void;

  toDelete: Account | null;
  openDelete: (a: Account) => void;
  closeDelete: () => void;

  qr: QrState;
  openQr: (qrCode: string, accountId: string) => void;
  closeQr: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  activeTab: "dashboard",
  setActiveTab: (activeTab) => set({ activeTab }),

  poolView: "all",
  setPoolView: (poolView) => set({ poolView }),

  showBanned: false,
  toggleBanned: () => set((s) => ({ showBanned: !s.showBanned })),

  addOpen: false,
  setAddOpen: (addOpen) => set({ addOpen }),

  detail: null,
  openDetail: (detail) => set({ detail }),
  closeDetail: () => set({ detail: null }),

  toDelete: null,
  openDelete: (toDelete) => set({ toDelete }),
  closeDelete: () => set({ toDelete: null }),

  qr: { open: false, qrCode: "", accountId: "" },
  openQr: (qrCode, accountId) => set({ qr: { open: true, qrCode, accountId } }),
  closeQr: () => set({ qr: { open: false, qrCode: "", accountId: "" } }),
}));
