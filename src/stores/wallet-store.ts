import { create } from 'zustand';

/**
 * @fileOverview Forge OS Economy Store
 * Real-time tracking of CVU credits and wallet balances.
 * Instrumented for direct Firestore binding.
 */

interface WalletState {
  balance: number;
  cvuCredits: number;
  spent: number;
  earned: number;
  isSyncing: boolean;
  updateWallet: (data: Partial<{ balance: number; cvuCredits: number; earned: number; spent: number }>) => void;
  setSyncing: (isSyncing: boolean) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  cvuCredits: 0,
  earned: 0,
  spent: 0,
  isSyncing: false,
  updateWallet: (data) => {
    set((state) => ({ ...state, ...data }));
  },
  setSyncing: (isSyncing) => set({ isSyncing }),
}));
