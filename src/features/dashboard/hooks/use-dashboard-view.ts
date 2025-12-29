import { useState } from "react";
import { useMoney } from "@/providers/money-provider";
import { useSpendingInsights } from "./use-spending-insights";

export function useDashboardView() {
  const {
    state,
    totals,
    walletBalances,
    spendingByCategory,
    trend,
    recentTransactions,
    recurring,
    showCents,
    resetDemoData,
    addCategory,
    deleteCategory,
  } = useMoney();

  // We don't seem to use dashboard filters in the UI anymore, but keeping logic
  // separated if we need to re-introduce search/tabs later.
  // For now, the view uses direct data.

  const { spendingRange, setSpendingRange, rangeFilteredSpending } =
    useSpendingInsights({
      state,
      spendingByCategory,
    });

  const [categoryDialog, setCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    addCategory(newCategory);
    setNewCategory("");
  };

  return {
    totals,
    walletBalances,
    recentTransactions,
    showCents,
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
  };
}
