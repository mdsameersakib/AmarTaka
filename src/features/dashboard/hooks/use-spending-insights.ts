import { useMemo, useState } from "react";
import type { CategorySpending, MoneyState } from "@/types/money";

type SpendingRange = "week" | "month" | "year";

type UseSpendingInsightsParams = {
  state: MoneyState;
  spendingByCategory: CategorySpending[];
};

export function useSpendingInsights({
  state,
  spendingByCategory,
}: UseSpendingInsightsParams) {
  const [spendingRange, setSpendingRange] = useState<SpendingRange>("month");

  const rangeFilteredSpending = useMemo(() => {
    const now = new Date();

    const isSameCalendarWeek = (date: Date) => {
      const startOfWeek = new Date(now);
      startOfWeek.setHours(0, 0, 0, 0);
      const day = startOfWeek.getDay();
      startOfWeek.setDate(startOfWeek.getDate() - day);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      return date >= startOfWeek && date < endOfWeek;
    };

    const isSameCalendarMonth = (date: Date) =>
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth();

    const isSameCalendarYear = (date: Date) =>
      date.getFullYear() === now.getFullYear();

    const categoryMap: Record<string, number> = {};
    state.categories.forEach((category) => {
      categoryMap[category] = 0;
    });

    state.transactions.forEach((tx) => {
      if (tx.type !== "expense") return;
      const txDate = new Date(tx.date);
      if (Number.isNaN(txDate.getTime())) return;

      let include = false;
      if (spendingRange === "week") {
        include = isSameCalendarWeek(txDate);
      } else if (spendingRange === "month") {
        include = isSameCalendarMonth(txDate);
      } else {
        include = isSameCalendarYear(txDate);
      }

      if (include) {
        categoryMap[tx.category] =
          (categoryMap[tx.category] ?? 0) + tx.amount;
      }
    });

    const ranged = Object.entries(categoryMap)
      .map<{ category: string; amount: number }>(([category, amount]) => ({
        category,
        amount,
      }))
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    if (ranged.length > 0) {
      return ranged;
    }

    return spendingByCategory;
  }, [state.transactions, state.categories, spendingRange, spendingByCategory]);

  return {
    spendingRange,
    setSpendingRange,
    rangeFilteredSpending,
  };
}

