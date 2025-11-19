import { useMemo, useState } from "react";
import type { Transaction } from "@/types/money";

type FilterType = "all" | "income" | "expense";

type UseDashboardFiltersParams = {
  recentTransactions: Transaction[];
  allTransactions: Transaction[];
};

export function useDashboardFilters({
  recentTransactions,
  allTransactions,
}: UseDashboardFiltersParams) {
  const [tab, setTab] = useState<"recent" | "all">("recent");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const visibleTransactions = useMemo(() => {
    const source = tab === "recent" ? recentTransactions : allTransactions;
    const lower = search.toLowerCase();
    return source.filter((tx) => {
      const matchesFilter = filter === "all" || tx.type === filter;
      const matchesSearch =
        !lower ||
        tx.category.toLowerCase().includes(lower) ||
        tx.wallet.toLowerCase().includes(lower) ||
        (tx.note ?? "").toLowerCase().includes(lower);
      return matchesFilter && matchesSearch;
    });
  }, [tab, recentTransactions, allTransactions, search, filter]);

  return {
    tab,
    setTab,
    search,
    setSearch,
    filter,
    setFilter,
    visibleTransactions,
  };
}

