import type { MoneyState, Transaction, TransactionInput } from "@/types/money";

export const TransactionService = {
  getAll: (state: MoneyState): Transaction[] => {
    return [...state.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  },

  add: (state: MoneyState, input: TransactionInput): MoneyState => {
    const newTx: Transaction = {
      ...input,
      id: Date.now(),
      amount: Number(input.amount),
    };

    return {
      ...state,
      transactions: [newTx, ...state.transactions],
    };
  },

  delete: (state: MoneyState, id: number): MoneyState => {
    return {
      ...state,
      transactions: state.transactions.filter((tx) => tx.id !== id),
    };
  },
};
