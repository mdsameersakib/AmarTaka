"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  CategorySpending,
  MoneyState,
  MoneyTotals,
  RecurringPayment,
  Transaction,
  TransactionInput,
  TrendPoint,
  WalletBalance,
} from "@/types/money";

const STORAGE_KEY = "amarTakaData_v3";

const DEMO_STATE: MoneyState = {
  wallets: ["Cash", "Bank", "PayPal", "Bkash", "Nagad"],
  walletInitialBalances: {
    Cash: 0,
    Bank: 0,
    PayPal: 0,
    Bkash: 0,
    Nagad: 0,
  },
  categories: [
    "Food",
    "Transport",
    "Salary",
    "Entertainment",
    "Shopping",
    "Bills",
    "Health",
    "Rent",
  ],
  transactions: [
    {
      id: 1715400000000,
      type: "income",
      amount: 4500,
      wallet: "Bank",
      category: "Salary",
      date: "2024-05-01",
      note: "Monthly Salary",
    },
    {
      id: 1715410000000,
      type: "expense",
      amount: 120,
      wallet: "Cash",
      category: "Food",
      date: "2024-05-02",
      note: "Grocery Shopping",
    },
    {
      id: 1715410005000,
      type: "expense",
      amount: 15,
      wallet: "Bkash",
      category: "Transport",
      date: "2024-05-02",
      note: "Rickshaw Fare",
    },
    {
      id: 1715420000000,
      type: "expense",
      amount: 250,
      wallet: "PayPal",
      category: "Shopping",
      date: "2024-05-03",
      note: "Online Subscription",
    },
    {
      id: 1715430000000,
      type: "expense",
      amount: 60,
      wallet: "Bank",
      category: "Bills",
      date: "2024-05-05",
      note: "Internet Bill",
    },
    {
      id: 1715440000000,
      type: "income",
      amount: 500,
      wallet: "Cash",
      category: "Entertainment",
      date: "2024-05-06",
      note: "Freelance Gig",
    },
    {
      id: 1715450000000,
      type: "expense",
      amount: 45.5,
      wallet: "Nagad",
      category: "Food",
      date: "2024-05-07",
      note: "Dinner with friends",
    },
    {
      id: 1715460000000,
      type: "expense",
      amount: 1200,
      wallet: "Bank",
      category: "Rent",
      date: "2024-05-01",
      note: "Apartment Rent",
    },
    {
      id: 1715470000000,
      type: "expense",
      amount: 30,
      wallet: "Cash",
      category: "Health",
      date: "2024-05-08",
      note: "Medicine",
    },
    {
      id: 1715480000000,
      type: "income",
      amount: 100,
      wallet: "Bkash",
      category: "Entertainment",
      date: "2024-05-09",
      note: "Gift",
    },
    {
      id: 1715490000000,
      type: "expense",
      amount: 25,
      wallet: "Cash",
      category: "Food",
      date: "2024-05-10",
      note: "Snacks",
    },
    {
      id: 1715500000000,
      type: "expense",
      amount: 10,
      wallet: "Cash",
      category: "Transport",
      date: "2024-05-10",
      note: "Bus Ticket",
    },
    {
      id: 1715510000000,
      type: "income",
      amount: 250,
      wallet: "Nagad",
      category: "Salary",
      date: "2024-05-11",
      note: "Bonus",
    },
    {
      id: 1715520000000,
      type: "expense",
      amount: 80,
      wallet: "Bank",
      category: "Bills",
      date: "2024-05-12",
      note: "Electricity",
    },
    {
      id: 1715530000000,
      type: "expense",
      amount: 1500,
      wallet: "Bank",
      category: "Shopping",
      date: "2024-05-13",
      note: "New Phone",
    },
  ],
  recurring: [
    { id: 1, name: "Netflix", amount: 12.99, date: "15th", type: "expense" },
    {
      id: 2,
      name: "Gym Membership",
      amount: 40,
      date: "1st",
      type: "expense",
    },
    { id: 3, name: "Spotify", amount: 9.99, date: "20th", type: "expense" },
  ],
  showCents: true,
};

const cloneDemoState = (): MoneyState =>
  JSON.parse(JSON.stringify(DEMO_STATE)) as MoneyState;

interface MoneyContextValue {
  state: MoneyState;
  totals: MoneyTotals;
  walletBalances: WalletBalance[];
  spendingByCategory: CategorySpending[];
  topCategory?: CategorySpending;
  trend: TrendPoint[];
  recentTransactions: Transaction[];
  allTransactions: Transaction[];
  recurring: RecurringPayment[];
  showCents: boolean;
  addTransaction: (input: TransactionInput) => void;
  deleteTransaction: (id: number) => void;
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;
  addWallet: (name: string) => void;
  deleteWallet: (name: string) => void;
  resetDemoData: () => void;
  setShowCents: (value: boolean) => void;
  toggleShowCents: () => void;
  isReady: boolean;
}

const MoneyContext = createContext<MoneyContextValue | null>(null);

export function MoneyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MoneyState>(() => cloneDemoState());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as MoneyState;
        const base = cloneDemoState();
        setState({
          ...base,
          ...parsed,
          showCents: (parsed as MoneyState).showCents ?? base.showCents,
        });
      } else {
        setState(cloneDemoState());
      }
    } catch {
      // ignore invalid payloads
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, isReady]);

  const sortedTransactions = useMemo(
    () =>
      [...state.transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [state.transactions],
  );

  const totalsAndWallets = useMemo(() => {
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
      } else {
        expense += amt;
        walletMap[tx.wallet] = (walletMap[tx.wallet] ?? 0) - amt;
      }
    });

    return {
      totals: {
        total: income - expense,
        income,
        expense,
      },
      walletBalances: state.wallets.map((wallet) => ({
        wallet,
        balance: walletMap[wallet] ?? 0,
      })),
    };
  }, [state.transactions, state.wallets, state.walletInitialBalances]);

  const spendingByCategory = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    state.categories.forEach((category) => {
      categoryMap[category] = 0;
    });

    state.transactions.forEach((tx) => {
      if (tx.type === "expense") {
        categoryMap[tx.category] = (categoryMap[tx.category] ?? 0) + tx.amount;
      }
    });

    return Object.entries(categoryMap)
      .map<CategorySpending>(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [state.transactions, state.categories]);

  const trend = useMemo(() => {
    const buckets: Record<string, { income: number; expense: number }> = {};
    state.transactions.forEach((tx) => {
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
      } else {
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
  }, [state.transactions]);

  const addTransaction = useCallback((input: TransactionInput) => {
    setState((prev) => ({
      ...prev,
      transactions: [
        {
          ...input,
          id: Date.now(),
          amount: Number(input.amount),
        },
        ...prev.transactions,
      ],
    }));
  }, []);

  const deleteTransaction = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((tx) => tx.id !== id),
    }));
  }, []);

  const addCategory = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => {
      if (prev.categories.includes(trimmed)) return prev;
      return {
        ...prev,
        categories: [...prev.categories, trimmed].sort((a, b) =>
          a.localeCompare(b),
        ),
      };
    });
  }, []);

  const deleteCategory = useCallback((name: string) => {
    setState((prev) => {
      const fallback =
        prev.categories.find((category) => category !== name) ||
        "Uncategorized";
      const nextCategories = prev.categories.filter(
        (category) => category !== name,
      );
      if (
        fallback === "Uncategorized" &&
        !nextCategories.includes("Uncategorized")
      ) {
        nextCategories.push("Uncategorized");
      }
      nextCategories.sort((a, b) => a.localeCompare(b));
      return {
        ...prev,
        categories: nextCategories,
        transactions: prev.transactions.map((tx) =>
          tx.category === name ? { ...tx, category: fallback } : tx,
        ),
      };
    });
  }, []);

  const addWallet = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => {
      if (prev.wallets.includes(trimmed)) return prev;
      return {
        ...prev,
        wallets: [...prev.wallets, trimmed].sort((a, b) => a.localeCompare(b)),
      };
    });
  }, []);

  const deleteWallet = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      wallets: prev.wallets.filter((wallet) => wallet !== name),
    }));
  }, []);

  const resetDemoData = useCallback(() => {
    setState(cloneDemoState());
  }, []);

  const setShowCents = useCallback((value: boolean) => {
    setState((prev) => ({
      ...prev,
      showCents: value,
    }));
  }, []);

  const toggleShowCents = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showCents: !prev.showCents,
    }));
  }, []);

  const value: MoneyContextValue = useMemo(
    () => ({
      state,
      totals: totalsAndWallets.totals,
      walletBalances: totalsAndWallets.walletBalances,
      spendingByCategory,
      topCategory: spendingByCategory[0],
      trend,
      recentTransactions: sortedTransactions.slice(0, 10),
      allTransactions: sortedTransactions,
      recurring: state.recurring,
      showCents: state.showCents,
      addTransaction,
      deleteTransaction,
      addCategory,
      deleteCategory,
      addWallet,
      deleteWallet,
      resetDemoData,
      setShowCents,
      toggleShowCents,
      isReady,
    }),
    [
      state,
      totalsAndWallets,
      spendingByCategory,
      trend,
      sortedTransactions,
      addTransaction,
      deleteTransaction,
      addCategory,
      deleteCategory,
      addWallet,
      deleteWallet,
      resetDemoData,
      setShowCents,
      toggleShowCents,
      isReady,
    ],
  );

  return (
    <MoneyContext.Provider value={value}>{children}</MoneyContext.Provider>
  );
}

export function useMoney() {
  const context = useContext(MoneyContext);
  if (!context) {
    throw new Error("useMoney must be used within a MoneyProvider");
  }
  return context;
}
