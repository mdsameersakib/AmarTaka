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
import { AnalyticsService } from "@/services/analytics-service";
import { CategoryService } from "@/services/category-service";
import { TransactionService } from "@/services/transaction-service";
import { WalletService } from "@/services/wallet-service";
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

  // Use Services for Derived State
  const sortedTransactions = useMemo(
    () => TransactionService.getAll(state),
    [state],
  );

  const { totals, walletBalances } = useMemo(
    () => AnalyticsService.calculateTotalsAndWallets(state),
    [state],
  );

  const spendingByCategory = useMemo(
    () => AnalyticsService.calculateSpendingByCategory(state),
    [state],
  );

  const trend = useMemo(() => AnalyticsService.calculateTrend(state), [state]);

  // Actions wrapped with Services
  const addTransaction = useCallback((input: TransactionInput) => {
    setState((prev) => TransactionService.add(prev, input));
  }, []);

  const deleteTransaction = useCallback((id: number) => {
    setState((prev) => TransactionService.delete(prev, id));
  }, []);

  const addCategory = useCallback((name: string) => {
    setState((prev) => CategoryService.add(prev, name));
  }, []);

  const deleteCategory = useCallback((name: string) => {
    setState((prev) => CategoryService.delete(prev, name));
  }, []);

  const addWallet = useCallback((name: string) => {
    setState((prev) => WalletService.add(prev, name));
  }, []);

  const deleteWallet = useCallback((name: string) => {
    setState((prev) => WalletService.delete(prev, name));
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
      totals,
      walletBalances,
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
      totals,
      walletBalances,
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
