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
import { formatLocalYMD } from "@/lib/date";
import { applyThemeToDocument, findThemeByColor } from "@/lib/theme";
import { AnalyticsService } from "@/services/analytics-service";
import { CategoryService } from "@/services/category-service";
import { LoanService } from "@/services/loan-service";
import { RecurringService } from "@/services/recurring-service";
import { TransactionService } from "@/services/transaction-service";
import { WalletService } from "@/services/wallet-service";
import type {
  BudgetGoal,
  CategorySpending,
  Loan,
  MoneyState,
  MoneyTotals,
  RecurringPayment,
  Transaction,
  TransactionInput,
  TrendPoint,
  WalletBalance,
} from "@/types/money";

const STORAGE_KEY = "amarTakaData_v4";

const DEMO_STATE: MoneyState = {
  wallets: ["Cash", "Bank"],
  walletInitialBalances: { Cash: 0, Bank: 0 },
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
  transactions: [],
  recurring: [],
  loans: [],
  budgetGoals: [],
  showCents: true,
  currencySymbol: "৳",
  accentColor: "#22c55e",
  balanceHidden: false,
  themeMode: "system",
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
  loans: Loan[];
  showCents: boolean;
  currencySymbol: string;
  accentColor: string;
  balanceHidden: boolean;
  themeMode: "light" | "dark" | "system";
  isDarkMode: boolean;
  setThemeMode: (mode: "light" | "dark" | "system") => void;
  toggleThemeMode: () => void;
  // Transactions
  addTransaction: (input: TransactionInput) => void;
  addTransfer: (
    fromWallet: string,
    toWallet: string,
    amount: number,
    fee?: number,
    note?: string,
  ) => void;
  deleteTransaction: (id: number) => void;
  updateTransaction: (id: number, input: TransactionInput) => void;
  // Categories
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;
  renameCategory: (oldName: string, newName: string) => void;
  // Wallets
  addWallet: (name: string) => void;
  deleteWallet: (name: string) => void;
  deleteWalletWithStrategy: (
    name: string,
    strategy: "cascade" | "move",
    targetWallet?: string,
  ) => void;
  updateWalletInitialBalance: (walletName: string, newBalance: number) => void;
  // Recurring
  addRecurring: (input: Omit<RecurringPayment, "id" | "nextDueDate">) => void;
  updateRecurring: (
    id: number,
    patch: Partial<Omit<RecurringPayment, "id">>,
  ) => void;
  deleteRecurring: (id: number) => void;
  payRecurring: (id: number) => void;
  // Loans
  addLoan: (input: Omit<Loan, "id">) => void;
  deleteLoan: (id: number) => void;
  payLoan: (loanId: number, amount: number) => void;
  // Budget goals
  budgetGoals: BudgetGoal[];
  setBudgetGoal: (category: string, monthlyLimit: number) => void;
  removeBudgetGoal: (category: string) => void;
  // Settings
  resetDemoData: () => void;
  setShowCents: (value: boolean) => void;
  toggleShowCents: () => void;
  setCurrencySymbol: (value: string) => void;
  setAccentColor: (hex: string) => void;
  toggleBalanceHidden: () => void;
  exportBackup: () => void;
  importBackup: (json: string) => boolean;
  isReady: boolean;
}

const MoneyContext = createContext<MoneyContextValue | null>(null);

export function MoneyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MoneyState>(() => cloneDemoState());
  const [isReady, setIsReady] = useState(false);
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPrefersDark(media.matches);
    const listener = (e: MediaQueryListEvent) =>
      setSystemPrefersDark(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const isDarkMode = useMemo(() => {
    if (state.themeMode === "dark") return true;
    if (state.themeMode === "light") return false;
    return systemPrefersDark;
  }, [state.themeMode, systemPrefersDark]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw =
        window.localStorage.getItem(STORAGE_KEY) ||
        window.localStorage.getItem("amarTakaData_v3") ||
        window.localStorage.getItem("amarTakaData");
      if (raw) {
        const parsed = JSON.parse(raw) as MoneyState;
        const base = cloneDemoState();
        const nextState: MoneyState = {
          ...base,
          ...parsed,
          showCents: parsed.showCents ?? base.showCents,
          currencySymbol: parsed.currencySymbol ?? base.currencySymbol,
          accentColor: parsed.accentColor ?? base.accentColor,
          balanceHidden: parsed.balanceHidden ?? base.balanceHidden,
          themeMode: parsed.themeMode ?? base.themeMode ?? "system",
          loans: (parsed.loans ?? []).map((l) => {
            const loan = l as Partial<Loan>;
            const durationMonths = loan.durationMonths || 12;
            const startDate = loan.startDate || formatLocalYMD();
            return {
              id: loan.id ?? Date.now(),
              lenderName: loan.lenderName ?? "Loan",
              direction: loan.direction ?? ("borrowed" as const),
              principal: loan.principal ?? 0,
              remaining: loan.remaining ?? loan.principal ?? 0,
              interestRate: loan.interestRate ?? 0,
              durationMonths,
              startDate,
              emiAmount: loan.emiAmount ?? 0,
              dueDate: loan.dueDate ?? startDate,
              walletName: loan.walletName ?? "Cash",
              note: loan.note,
            };
          }),
          budgetGoals: parsed.budgetGoals ?? [],
          recurring: (parsed.recurring ?? []).map((r) => {
            const rec = r as Partial<RecurringPayment>;
            return {
              id: rec.id ?? Date.now(),
              name: rec.name ?? "",
              amount: rec.amount ?? 0,
              walletName: rec.walletName ?? "Cash",
              category: rec.category ?? "Bills",
              type: rec.type ?? ("expense" as const),
              lastPaidDate: rec.lastPaidDate ?? null,
              nextDueDate: rec.nextDueDate ?? formatLocalYMD(),
              frequency: rec.frequency ?? ("monthly" as const),
              dueDay: rec.dueDay ?? 1,
            };
          }),
        };
        setState(nextState);
        const isDark =
          nextState.themeMode === "dark" ||
          (nextState.themeMode !== "light" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);
        applyThemeToDocument(findThemeByColor(nextState.accentColor), isDark);
      } else {
        const demo = cloneDemoState();
        setState(demo);
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        applyThemeToDocument(findThemeByColor(demo.accentColor), isDark);
      }
    } catch {
      // ignore
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    applyThemeToDocument(findThemeByColor(state.accentColor), isDarkMode);
  }, [state, isReady, isDarkMode]);

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

  const addTransaction = useCallback((input: TransactionInput) => {
    setState((prev) => TransactionService.add(prev, input));
  }, []);

  const addTransfer = useCallback(
    (
      fromWallet: string,
      toWallet: string,
      amount: number,
      fee = 0,
      note = "",
    ) => {
      setState((prev) => {
        const tx = {
          id: Date.now(),
          type: "transfer" as const,
          amount,
          wallet: fromWallet,
          toWallet,
          transferFee: fee,
          category: "Transfer",
          date: formatLocalYMD(),
          note: note || `${fromWallet} → ${toWallet}`,
        };
        return { ...prev, transactions: [tx, ...prev.transactions] };
      });
    },
    [],
  );

  const deleteTransaction = useCallback((id: number) => {
    setState((prev) => TransactionService.delete(prev, id));
  }, []);

  const updateTransaction = useCallback(
    (id: number, input: TransactionInput) => {
      setState((prev) => ({
        ...prev,
        transactions: prev.transactions.map((tx) =>
          tx.id === id ? { ...tx, ...input, id } : tx,
        ),
      }));
    },
    [],
  );

  const addCategory = useCallback((name: string) => {
    setState((prev) => CategoryService.add(prev, name));
  }, []);

  const deleteCategory = useCallback((name: string) => {
    setState((prev) => CategoryService.delete(prev, name));
  }, []);

  const renameCategory = useCallback((oldName: string, newName: string) => {
    setState((prev) => {
      let next = CategoryService.rename(prev, oldName, newName);
      next = TransactionService.updateCategoryName(next, oldName, newName);
      return next;
    });
  }, []);

  const addWallet = useCallback((name: string) => {
    setState((prev) => WalletService.add(prev, name));
  }, []);

  const deleteWallet = useCallback((name: string) => {
    setState((prev) => WalletService.delete(prev, name));
  }, []);

  const deleteWalletWithStrategy = useCallback(
    (name: string, strategy: "cascade" | "move", targetWallet?: string) => {
      setState((prev) => {
        let next = prev;
        const fallbackWallet =
          targetWallet || prev.wallets.find((w) => w !== name) || "Cash";
        if (strategy === "cascade") {
          next = TransactionService.deleteByWallet(next, name);
        } else if (strategy === "move" && targetWallet) {
          next = TransactionService.updateWalletName(next, name, targetWallet);
        }
        next = {
          ...next,
          loans: next.loans.map((l) =>
            l.walletName === name ? { ...l, walletName: fallbackWallet } : l,
          ),
          recurring: next.recurring.map((r) =>
            r.walletName === name ? { ...r, walletName: fallbackWallet } : r,
          ),
        };
        next = WalletService.delete(next, name);
        return next;
      });
    },
    [],
  );

  const updateWalletInitialBalance = useCallback(
    (walletName: string, newBalance: number) => {
      setState((prev) => ({
        ...prev,
        walletInitialBalances: {
          ...(prev.walletInitialBalances ?? {}),
          [walletName]: newBalance,
        },
      }));
    },
    [],
  );

  // Recurring
  const addRecurring = useCallback(
    (input: Omit<RecurringPayment, "id" | "nextDueDate">) => {
      setState((prev) => RecurringService.add(prev, input));
    },
    [],
  );

  const updateRecurring = useCallback(
    (id: number, patch: Partial<Omit<RecurringPayment, "id">>) => {
      setState((prev) => RecurringService.update(prev, id, patch));
    },
    [],
  );

  const deleteRecurring = useCallback((id: number) => {
    setState((prev) => RecurringService.delete(prev, id));
  }, []);

  const payRecurring = useCallback((id: number) => {
    setState((prev) => RecurringService.pay(prev, id));
  }, []);

  // Loans
  const addLoan = useCallback((input: Omit<Loan, "id">) => {
    setState((prev) => LoanService.add(prev, input));
  }, []);

  const deleteLoan = useCallback((id: number) => {
    setState((prev) => LoanService.delete(prev, id));
  }, []);

  const payLoan = useCallback((loanId: number, amount: number) => {
    setState((prev) => LoanService.pay(prev, loanId, amount));
  }, []);

  // Budget goals
  const setBudgetGoal = useCallback(
    (category: string, monthlyLimit: number) => {
      setState((prev) => {
        const existing = prev.budgetGoals.filter(
          (g) => g.category !== category,
        );
        return {
          ...prev,
          budgetGoals: [...existing, { category, monthlyLimit }],
        };
      });
    },
    [],
  );

  const removeBudgetGoal = useCallback((category: string) => {
    setState((prev) => ({
      ...prev,
      budgetGoals: prev.budgetGoals.filter((g) => g.category !== category),
    }));
  }, []);

  const resetDemoData = useCallback(() => {
    setState(cloneDemoState());
  }, []);

  const setShowCents = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, showCents: value }));
  }, []);

  const toggleShowCents = useCallback(() => {
    setState((prev) => ({ ...prev, showCents: !prev.showCents }));
  }, []);

  const setCurrencySymbol = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setState((prev) => ({ ...prev, currencySymbol: trimmed }));
  }, []);

  const setAccentColor = useCallback((hex: string) => {
    setState((prev) => ({ ...prev, accentColor: hex }));
  }, []);

  const toggleBalanceHidden = useCallback(() => {
    setState((prev) => ({ ...prev, balanceHidden: !prev.balanceHidden }));
  }, []);

  const setThemeMode = useCallback((mode: "light" | "dark" | "system") => {
    setState((prev) => ({ ...prev, themeMode: mode }));
  }, []);

  const toggleThemeMode = useCallback(() => {
    setState((prev) => {
      const currentlyDark =
        prev.themeMode === "dark" ||
        (prev.themeMode !== "light" &&
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      return {
        ...prev,
        themeMode: currentlyDark ? "light" : "dark",
      };
    });
  }, []);

  const exportBackup = useCallback(() => {
    if (typeof window === "undefined") return;
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `amartaka-backup-${formatLocalYMD()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importBackup = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as MoneyState;
      if (!parsed.wallets || !parsed.transactions) return false;
      const base = cloneDemoState();
      const nextState: MoneyState = {
        ...base,
        ...parsed,
        loans: (parsed.loans ?? []).map((l) => {
          const loan = l as Partial<Loan>;
          const durationMonths = loan.durationMonths || 12;
          const startDate = loan.startDate || formatLocalYMD();
          return {
            id: loan.id ?? Date.now(),
            lenderName: loan.lenderName ?? "Loan",
            direction: loan.direction ?? ("borrowed" as const),
            principal: loan.principal ?? 0,
            remaining: loan.remaining ?? loan.principal ?? 0,
            interestRate: loan.interestRate ?? 0,
            durationMonths,
            startDate,
            emiAmount: loan.emiAmount ?? 0,
            dueDate: loan.dueDate ?? startDate,
            walletName: loan.walletName ?? "Cash",
            note: loan.note,
          };
        }),
        budgetGoals: parsed.budgetGoals ?? [],
        accentColor: parsed.accentColor ?? base.accentColor,
        balanceHidden: false,
        recurring: (parsed.recurring ?? []).map((r) => {
          const rec = r as Partial<RecurringPayment>;
          return {
            id: rec.id ?? Date.now(),
            name: rec.name ?? "",
            amount: rec.amount ?? 0,
            walletName: rec.walletName ?? "Cash",
            category: rec.category ?? "Bills",
            type: rec.type ?? ("expense" as const),
            lastPaidDate: rec.lastPaidDate ?? null,
            nextDueDate: rec.nextDueDate ?? formatLocalYMD(),
            frequency: rec.frequency ?? ("monthly" as const),
            dueDay: rec.dueDay ?? 1,
          };
        }),
      };
      setState(nextState);
      applyThemeToDocument(findThemeByColor(nextState.accentColor));
      return true;
    } catch {
      return false;
    }
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
      loans: state.loans,
      showCents: state.showCents,
      currencySymbol: state.currencySymbol,
      accentColor: state.accentColor,
      balanceHidden: state.balanceHidden,
      themeMode: state.themeMode ?? "system",
      isDarkMode,
      setThemeMode,
      toggleThemeMode,
      budgetGoals: state.budgetGoals,
      addTransaction,
      addTransfer,
      deleteTransaction,
      updateTransaction,
      addCategory,
      deleteCategory,
      renameCategory,
      addWallet,
      deleteWallet,
      deleteWalletWithStrategy,
      updateWalletInitialBalance,
      addRecurring,
      updateRecurring,
      deleteRecurring,
      payRecurring,
      addLoan,
      deleteLoan,
      payLoan,
      setBudgetGoal,
      removeBudgetGoal,
      resetDemoData,
      setShowCents,
      toggleShowCents,
      setCurrencySymbol,
      setAccentColor,
      toggleBalanceHidden,
      exportBackup,
      importBackup,
      isReady,
    }),
    [
      state,
      totals,
      walletBalances,
      spendingByCategory,
      trend,
      sortedTransactions,
      isDarkMode,
      setThemeMode,
      toggleThemeMode,
      addTransaction,
      addTransfer,
      deleteTransaction,
      updateTransaction,
      addCategory,
      deleteCategory,
      renameCategory,
      addWallet,
      deleteWallet,
      deleteWalletWithStrategy,
      updateWalletInitialBalance,
      addRecurring,
      updateRecurring,
      deleteRecurring,
      payRecurring,
      addLoan,
      deleteLoan,
      payLoan,
      setBudgetGoal,
      removeBudgetGoal,
      resetDemoData,
      setShowCents,
      toggleShowCents,
      setCurrencySymbol,
      setAccentColor,
      toggleBalanceHidden,
      exportBackup,
      importBackup,
      isReady,
    ],
  );

  return (
    <MoneyContext.Provider value={value}>{children}</MoneyContext.Provider>
  );
}

export function useMoney() {
  const context = useContext(MoneyContext);
  if (!context) throw new Error("useMoney must be used within a MoneyProvider");
  return context;
}
