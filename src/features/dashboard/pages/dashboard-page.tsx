"use client";

import { FloatingActionLauncher } from "@/features/dashboard/components/floating-action-launcher";
import { LoansSection } from "@/features/dashboard/components/loans-section";
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
    <div className="relative pb-32 sm:pb-36 flex flex-col gap-5 sm:gap-8">
      <section className="space-y-2.5 sm:space-y-3">
        <SummaryCard
          label="Total Balance"
          amount={totals.total}
          showCents={showCents}
          currencySymbol={currencySymbol}
        />
        <div className="grid grid-cols-2 gap-3">
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
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="min-w-0 lg:col-span-3 space-y-6">
          <WalletsSection walletBalances={walletBalances} />
          <LoansSection />
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

        <div className="min-w-0 space-y-6 rounded-[28px] sm:rounded-[32px] border-3 sm:border-4 border-[var(--border)] bg-white p-4 sm:p-6 shadow-neo lg:col-span-2">
          <MonthlyTrendSection
            trend={trend}
            showCents={showCents}
            currencySymbol={currencySymbol}
          />
          <RecurringSection />
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
