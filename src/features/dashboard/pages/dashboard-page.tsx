"use client";

import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  RefreshCw,
  Search,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import { useMoney } from "@/providers/money-provider";
import type { Transaction } from "@/types/money";
import { AddTransactionSheet } from "@/features/dashboard/components/transaction-form";
import { ManageDialog } from "@/features/dashboard/components/manage-dialog";
import { useTransactionLauncher } from "@/features/dashboard/hooks/use-transaction-launcher";
import { FloatingActionLauncher } from "@/features/dashboard/components/floating-action-launcher";
import { SummaryCard } from "@/features/dashboard/components/summary-card";
import { TransactionList } from "@/features/dashboard/components/transaction-list";
import { WalletCard } from "@/features/dashboard/components/wallet-card";
import { WalletsSection } from "@/features/dashboard/components/wallets-section";
import { RecentTransactionsSection } from "@/features/dashboard/components/recent-transactions-section";
import { SpendingInsightsSection } from "@/features/dashboard/components/spending-insights-section";
import { MonthlyTrendSection } from "@/features/dashboard/components/monthly-trend-section";
import { RecurringSection } from "@/features/dashboard/components/recurring-section";
import { useDashboardFilters } from "@/features/dashboard/hooks/use-dashboard-filters";
import { useSpendingInsights } from "@/features/dashboard/hooks/use-spending-insights";
import { formatDateTimeDemo } from "@/features/dashboard/lib/date";

export default function DashboardPage() {
  const {
      state,
      totals,
      walletBalances,
      spendingByCategory,
      trend,
      recentTransactions,
    allTransactions,
    recurring,
    showCents,
    addTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    addWallet,
    deleteWallet,
      resetDemoData,
    } = useMoney();

  const {
    tab,
    setTab,
    search,
    setSearch,
    filter,
    setFilter,
    visibleTransactions,
  } = useDashboardFilters({
    recentTransactions,
    allTransactions,
  });

  const {
    spendingRange,
    setSpendingRange,
    rangeFilteredSpending,
  } = useSpendingInsights({
    state,
    spendingByCategory,
  });

  const {
    isTypeSelectorOpen,
    setIsTypeSelectorOpen,
    isFormOpen,
    setIsFormOpen,
    formType,
    formData,
    setFormData,
    openForm,
    handleSubmit,
  } = useTransactionLauncher();
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  return (
    <div className="relative mb-20 flex flex-col gap-8">
      <section className="space-y-4">
        <SummaryCard
          label="Total Balance"
          amount={totals.total}
          showCents={showCents}
        />
        <SummaryCard
          label="Income"
          amount={totals.income}
          accent="income"
          showCents={showCents}
        />
        <SummaryCard
          label="Expenses"
          amount={totals.expense}
          accent="expense"
          showCents={showCents}
        />
        </section>

        <section className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <WalletsSection walletBalances={walletBalances} />

            <RecentTransactionsSection
              recentTransactions={recentTransactions}
              showCents={showCents}
            />

            <SpendingInsightsSection
              spendingRange={spendingRange}
              setSpendingRange={setSpendingRange}
              rangeFilteredSpending={rangeFilteredSpending}
              showCents={showCents}
            />
          </div>

        <div className="space-y-6 rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712] lg:col-span-2">
          <MonthlyTrendSection trend={trend} showCents={showCents} />

          <RecurringSection
            recurring={recurring}
            showCents={showCents}
            onReset={resetDemoData}
          />
        </div>
      </section>

      <FloatingActionLauncher
        open={isTypeSelectorOpen}
        onOpenChange={setIsTypeSelectorOpen}
        onSelectType={openForm}
      />

      <AddTransactionSheet
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        formType={formType}
        formData={formData}
        setFormData={setFormData}
        wallets={state.wallets}
        categories={state.categories}
        onSubmit={handleSubmit}
      />

      <ManageDialog
        title="Categories"
        open={categoryDialog}
        onOpenChange={setCategoryDialog}
        items={state.categories}
        inputValue={newCategory}
        onInputChange={setNewCategory}
        onAdd={() => {
          if (!newCategory.trim()) return;
          addCategory(newCategory);
          setNewCategory("");
        }}
        onDelete={deleteCategory}
      />

    </div>
  );
}
