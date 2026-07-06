import { create } from "zustand";

export type PendingAuthAction = "save-meal" | "saved-page" | null;

export interface AppStore {
  pendingAuthAction: PendingAuthAction;
  setPendingAuthAction: (action: PendingAuthAction) => void;
  clearPendingAuthAction: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  pendingAuthAction: null,
  setPendingAuthAction: (action) => set({ pendingAuthAction: action }),
  clearPendingAuthAction: () => set({ pendingAuthAction: null }),
}));
