import type {
  CategorySpending,
  MoneyState,
  MoneyTotals,
  TrendPoint,
  WalletBalance,
} from "@/types/money";

export const AnalyticsService = {
  calculateTotalsAndWallets: (
    state: MoneyState,
  ): { totals: MoneyTotals; walletBalances: WalletBalance[] } => {
    const walletMap: Record<string, number> = {};
    const initialBalances = state.walletInitialBalances ?? {};

    state.wallets.forEach((wallet) => {
      walletMap[wallet] = Number(initialBalances[wallet] ?? 0);
    });

    let income = 0;
    let expense = 0;

    state.transactions.forEach((tx) => {
      const amt = Number(tx.amount);
      if (tx.type === "income") {
        income += amt;
        walletMap[tx.wallet] = (walletMap[tx.wallet] ?? 0) + amt;
      } else if (tx.type === "expense") {
        expense += amt;
        walletMap[tx.wallet] = (walletMap[tx.wallet] ?? 0) - amt;
      } else if (tx.type === "transfer") {
        // debit fromWallet, credit toWallet — no income/expense impact
        walletMap[tx.wallet] = (walletMap[tx.wallet] ?? 0) - amt;
        if (tx.toWallet) {
          walletMap[tx.toWallet] = (walletMap[tx.toWallet] ?? 0) + amt;
        }
        // fee is a real expense from the fromWallet
        if (tx.transferFee && tx.transferFee > 0) {
          expense += tx.transferFee;
          walletMap[tx.wallet] = (walletMap[tx.wallet] ?? 0) - tx.transferFee;
        }
      }
    });

    // Total balance = sum of all wallet balances
    const total = Object.values(walletMap).reduce((sum, b) => sum + b, 0);

    return {
      totals: { total, income, expense },
      walletBalances: state.wallets.map((wallet) => ({
        wallet,
        balance: walletMap[wallet] ?? 0,
      })),
    };
  },

  calculateSpendingByCategory: (state: MoneyState): CategorySpending[] => {
    const categoryMap: Record<string, number> = {};
    state.categories.forEach((category) => {
      categoryMap[category] = 0;
    });

    state.transactions.forEach((tx) => {
      if (tx.type !== "expense") return;
      categoryMap[tx.category] = (categoryMap[tx.category] ?? 0) + tx.amount;
    });

    return Object.entries(categoryMap)
      .map<CategorySpending>(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  },

  calculateTrend: (state: MoneyState): TrendPoint[] => {
    const buckets: Record<string, { income: number; expense: number }> = {};
    state.transactions.forEach((tx) => {
      if (tx.type === "transfer") return; // exclude transfers from trend
      const date = new Date(tx.date);
      if (Number.isNaN(date.getTime())) return;
      const label = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (!buckets[label]) {
        buckets[label] = { income: 0, expense: 0 };
      }
      if (tx.type === "income") {
        buckets[label].income += tx.amount;
      } else if (tx.type === "expense") {
        buckets[label].expense += tx.amount;
      }
    });

    const toTimestamp = (label: string) => {
      const [mon, yr] = label.split(" ");
      const parsed = Date.parse(`${mon} 1, 20${yr}`);
      return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
    };

    return Object.entries(buckets)
      .map<TrendPoint>(([label, totals]) => ({
        label,
        income: Number(totals.income.toFixed(2)),
        expense: Number(totals.expense.toFixed(2)),
      }))
      .sort((a, b) => toTimestamp(a.label) - toTimestamp(b.label));
  },
};
