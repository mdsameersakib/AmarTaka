import { useEffect, useMemo, useState } from "react";
import type { Transaction } from "@/types/money";

export function usePaginatedTransactions(
  filteredTransactions: Transaction[],
  itemsPerPage = 10,
) {
  const [page, setPage] = useState(1);

  // Reset page when filters change (i.e., when the filtered list changes)
  // biome-ignore lint/correctness/useExhaustiveDependencies: filteredTransactions is a function argument and critical for this effect
  useEffect(() => {
    setPage(1);
  }, [filteredTransactions]);

  const displayedTransactions = useMemo(() => {
    return filteredTransactions.slice(0, page * itemsPerPage);
  }, [filteredTransactions, page, itemsPerPage]);

  const hasMore = displayedTransactions.length < filteredTransactions.length;

  const loadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const groupedByDate = useMemo(() => {
    const groups: { date: string; items: Transaction[] }[] = [];
    const byKey = new Map<string, { date: string; items: Transaction[] }>();

    displayedTransactions.forEach((tx) => {
      const key = tx.date.slice(0, 10);
      let group = byKey.get(key);
      if (!group) {
        group = { date: key, items: [] };
        byKey.set(key, group);
        groups.push(group);
      }
      group.items.push(tx);
    });

    return groups;
  }, [displayedTransactions]);

  return { displayedTransactions, groupedByDate, hasMore, loadMore };
}
