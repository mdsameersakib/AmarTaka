import type { MoneyState } from "@/types/money";

export const WalletService = {
  getWallets: (state: MoneyState): string[] => {
    return state.wallets;
  },

  add: (state: MoneyState, name: string): MoneyState => {
    const trimmed = name.trim();
    if (!trimmed || state.wallets.includes(trimmed)) return state;

    return {
      ...state,
      wallets: [...state.wallets, trimmed].sort((a, b) => a.localeCompare(b)),
    };
  },

  delete: (state: MoneyState, name: string): MoneyState => {
    return {
      ...state,
      wallets: state.wallets.filter((wallet) => wallet !== name),
    };
  },
};
