import { useMemo } from "react";
import type { Transaction } from "@/types/money";
import type { useTransactionFilters } from "./use-transaction-filters";

type UseTransactionFiltersReturn = ReturnType<typeof useTransactionFilters>;

export function useFilteredTransactions(
  allTransactions: Transaction[],
  filters: UseTransactionFiltersReturn,
) {
  const {
    dateMode,
    singleDate,
    rangeFrom,
    rangeTo,
    searchNote,
    typeFilter,
    walletFilter,
    categoryFilter,
  } = filters;

  const filtered = useMemo(() => {
    const lowerNote = searchNote.toLowerCase();

    const normalizeDate = (value: string) => {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return null;
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    };

    const singleTarget =
      dateMode === "single" ? normalizeDate(singleDate) : null;
    const fromTarget =
      dateMode === "range" && rangeFrom ? normalizeDate(rangeFrom) : null;
    const toTarget =
      dateMode === "range" && rangeTo ? normalizeDate(rangeTo) : null;

    return allTransactions.filter((tx) => {
      const txTime = normalizeDate(tx.date);
      if (txTime === null) return false;

      if (dateMode === "single" && singleTarget !== null) {
        if (txTime !== singleTarget) return false;
      }

      if (dateMode === "range") {
        if (fromTarget !== null && txTime < fromTarget) return false;
        if (toTarget !== null && txTime > toTarget) return false;
      }

      const matchesType = typeFilter === "all" || tx.type === typeFilter;
      if (!matchesType) return false;

      const matchesWallet =
        walletFilter === "all" ||
        tx.wallet === walletFilter ||
        tx.toWallet === walletFilter;
      if (!matchesWallet) return false;

      const matchesCategory =
        categoryFilter === "all" || tx.category === categoryFilter;
      if (!matchesCategory) return false;

      const searchableText = [tx.note, tx.category, tx.wallet, tx.toWallet]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !lowerNote || searchableText.includes(lowerNote);

      return matchesSearch;
    });
  }, [
    allTransactions,
    dateMode,
    singleDate,
    rangeFrom,
    rangeTo,
    typeFilter,
    walletFilter,
    categoryFilter,
    searchNote,
  ]);

  const groupedByDate = useMemo(() => {
    const groups: { date: string; items: Transaction[] }[] = [];
    const byKey = new Map<string, { date: string; items: Transaction[] }>();

    filtered.forEach((tx) => {
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
  }, [filtered]);

  return { filtered, groupedByDate };
}
