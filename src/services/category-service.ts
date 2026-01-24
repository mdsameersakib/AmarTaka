import type { MoneyState } from "@/types/money";

export const CategoryService = {
  getCategories: (state: MoneyState): string[] => {
    return state.categories;
  },

  add: (state: MoneyState, name: string): MoneyState => {
    const trimmed = name.trim();
    if (!trimmed || state.categories.includes(trimmed)) return state;

    return {
      ...state,
      categories: [...state.categories, trimmed].sort((a, b) =>
        a.localeCompare(b),
      ),
    };
  },

  delete: (state: MoneyState, name: string): MoneyState => {
    const fallback =
      state.categories.find((category) => category !== name) || "Uncategorized";
    const nextCategories = state.categories.filter(
      (category) => category !== name,
    );

    if (
      fallback === "Uncategorized" &&
      !nextCategories.includes("Uncategorized")
    ) {
      nextCategories.push("Uncategorized");
    }
    nextCategories.sort((a, b) => a.localeCompare(b));

    // Update transactions to use fallback category
    const nextTransactions = state.transactions.map((tx) =>
      tx.category === name ? { ...tx, category: fallback } : tx,
    );

    return {
      ...state,
      categories: nextCategories,
      transactions: nextTransactions,
    };
  },

  rename: (state: MoneyState, oldName: string, newName: string): MoneyState => {
    const trimmed = newName.trim();
    if (!trimmed || state.categories.includes(trimmed)) return state;

    const nextCategories = state.categories.map((c) =>
      c === oldName ? trimmed : c,
    );
    nextCategories.sort((a, b) => a.localeCompare(b));

    return {
      ...state,
      categories: nextCategories,
    };
  },
};
