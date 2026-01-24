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

// Updated: Clean Slate for v1 Release
const DEMO_STATE: MoneyState = {
  wallets: ["Cash", "Bank"],
  walletInitialBalances: {
    Cash: 0,
    Bank: 0,
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
  transactions: [], // Empty for fresh start
  recurring: [], // Empty for fresh start
  showCents: true,
  currencySymbol: "৳",
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
  currencySymbol: string;
  addTransaction: (input: TransactionInput) => void;
  deleteTransaction: (id: number) => void;
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;
  renameCategory: (oldName: string, newName: string) => void;
  addWallet: (name: string) => void;
  deleteWallet: (name: string) => void;
  deleteWalletWithStrategy: (
    name: string,
    strategy: "cascade" | "move",
    targetWallet?: string,
  ) => void;
  resetDemoData: () => void;
  setShowCents: (value: boolean) => void;
  toggleShowCents: () => void;
  setCurrencySymbol: (value: string) => void;
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
          currencySymbol:
            (parsed as MoneyState).currencySymbol ?? base.currencySymbol,
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

  const renameCategory = useCallback((oldName: string, newName: string) => {
    setState((prev) => {
      // 1. Rename in list
      let next = CategoryService.rename(prev, oldName, newName);
      // 2. Rename in transactions
      next = TransactionService.updateCategoryName(next, oldName, newName);
      return next;
    });
  }, []);

  const addWallet = useCallback((name: string) => {
    setState((prev) => WalletService.add(prev, name));
  }, []);

  const deleteWallet = useCallback((name: string) => {
    // Default simple delete (legacy), though UI should preferably use strategy
    setState((prev) => WalletService.delete(prev, name));
  }, []);

  const deleteWalletWithStrategy = useCallback(
    (name: string, strategy: "cascade" | "move", targetWallet?: string) => {
      setState((prev) => {
        let next = prev;

        if (strategy === "cascade") {
          next = TransactionService.deleteByWallet(next, name);
        } else if (strategy === "move" && targetWallet) {
          next = TransactionService.updateWalletName(next, name, targetWallet);
        }

        // Finally delete the wallet itself
        next = WalletService.delete(next, name);
        return next;
      });
    },
    [],
  );

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

  const setCurrencySymbol = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      currencySymbol: trimmed,
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
      currencySymbol: state.currencySymbol,
      addTransaction,
      deleteTransaction,
      addCategory,
      deleteCategory,
      renameCategory,
      addWallet,
      deleteWallet,
      deleteWalletWithStrategy,
      resetDemoData,
      setShowCents,
      toggleShowCents,
      setCurrencySymbol,
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
      renameCategory,
      addWallet,
      deleteWallet,
      deleteWalletWithStrategy,
      resetDemoData,
      setShowCents,
      toggleShowCents,
      setCurrencySymbol,
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
