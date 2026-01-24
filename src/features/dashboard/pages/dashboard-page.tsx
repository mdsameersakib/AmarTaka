"use client";

import { FloatingActionLauncher } from "@/features/dashboard/components/floating-action-launcher";
import { ManageDialog } from "@/features/dashboard/components/manage-dialog";
import { MonthlyTrendSection } from "@/features/dashboard/components/monthly-trend-section";
import { RecentTransactionsSection } from "@/features/dashboard/components/recent-transactions-section";
import { RecurringSection } from "@/features/dashboard/components/recurring-section";
import { SpendingInsightsSection } from "@/features/dashboard/components/spending-insights-section";
import { SummaryCard } from "@/features/dashboard/components/summary-card";
import { AddTransactionSheet } from "@/features/dashboard/components/transaction-form";
import { WalletsSection } from "@/features/dashboard/components/wallets-section";
import { useDashboardView } from "@/features/dashboard/hooks/use-dashboard-view";
import { useTransactionLauncher } from "@/features/dashboard/hooks/use-transaction-launcher";

export default function DashboardPage() {
  const {
    totals,
    walletBalances,
    recentTransactions,
    showCents,
    currencySymbol,
    trend,
    recurring,
    resetDemoData,
    spendingRange,
    setSpendingRange,
    rangeFilteredSpending,
    categoryDialog,
    setCategoryDialog,
    newCategory,
    setNewCategory,
    state,
    deleteCategory,
    handleAddCategory,
  } = useDashboardView();

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

  return (
    <div className="relative mb-20 flex flex-col gap-8">
      <section className="space-y-4">
        <SummaryCard
          label="Total Balance"
          amount={totals.total}
          showCents={showCents}
          currencySymbol={currencySymbol}
        />
        <SummaryCard
          label="Income"
          amount={totals.income}
          accent="income"
          showCents={showCents}
          currencySymbol={currencySymbol}
        />
        <SummaryCard
          label="Expenses"
          amount={totals.expense}
          accent="expense"
          showCents={showCents}
          currencySymbol={currencySymbol}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <WalletsSection walletBalances={walletBalances} />

          <RecentTransactionsSection
            recentTransactions={recentTransactions}
            showCents={showCents}
            currencySymbol={currencySymbol}
          />

          <SpendingInsightsSection
            spendingRange={spendingRange}
            setSpendingRange={setSpendingRange}
            rangeFilteredSpending={rangeFilteredSpending}
            showCents={showCents}
            currencySymbol={currencySymbol}
          />
        </div>

        <div className="space-y-6 rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo lg:col-span-2">
          <MonthlyTrendSection
            trend={trend}
            showCents={showCents}
            currencySymbol={currencySymbol}
          />

          <RecurringSection
            recurring={recurring}
            showCents={showCents}
            currencySymbol={currencySymbol}
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
        onAdd={handleAddCategory}
        onDelete={deleteCategory}
      />
    </div>
  );
}
