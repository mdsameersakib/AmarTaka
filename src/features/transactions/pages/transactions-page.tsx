"use client";

import { useMemo, useState } from "react";

import { ChevronDown, PlusIcon } from "lucide-react";
import { useMoney } from "@/providers/money-provider";
import type { Transaction, TransactionType } from "@/types/money";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import {
  FilterPill,
  FilterSummary,
  SearchFilter,
  SelectField,
} from "@/features/transactions/components/filters";

type FilterType = "all" | TransactionType;
type DateMode = "single" | "range";

export default function TransactionsPage() {
  const { allTransactions, state, deleteTransaction, showCents } = useMoney();
  const [showFilters, setShowFilters] = useState(false);

  const [dateMode, setDateMode] = useState<DateMode>("single");
  const [singleDate, setSingleDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [rangeFrom, setRangeFrom] = useState<string>("");
  const [rangeTo, setRangeTo] = useState<string>("");

  const [searchNote, setSearchNote] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [walletFilter, setWalletFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const lowerNote = searchNote.toLowerCase();

    const normalizeDate = (value: string) => {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return null;
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    };

    const singleTarget = dateMode === "single" ? normalizeDate(singleDate) : null;
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

      const matchesWallet = walletFilter === "all" || tx.wallet === walletFilter;
      if (!matchesWallet) return false;

      const matchesCategory =
        categoryFilter === "all" || tx.category === categoryFilter;
      if (!matchesCategory) return false;

      const note = tx.note ?? "";
      const matchesNote =
        !lowerNote || note.toLowerCase().includes(lowerNote);

      return matchesNote;
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

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border-4 border-[#0f172a] bg-white p-4 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-[#0f172a] shadow-neo-sm transition hover:-translate-y-0.5 hover:bg-[#fefce8] dark:border-[#4ade80] dark:bg-[#020617] dark:text-[#4ade80]"
          >
            <span>Filters</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                showFilters && "rotate-180",
              )}
            />
          </button>
        </div>

        {showFilters && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-1 space-y-3 rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] p-4 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f172a]/60 dark:text-[#bbf7d0]/70">
                Date
              </p>
              <div className="inline-flex rounded-full border-2 border-[#0f172a] bg-white p-1 text-xs font-semibold shadow-neo-sm dark:border-[#4ade80] dark:bg-black">
                <button
                  type="button"
                  className={`rounded-full px-3 py-1 ${
                    dateMode === "single"
                      ? "bg-[#0f172a] text-[#fefce8] dark:bg-[#4ade80] dark:text-[#022c22]"
                      : "text-[#0f172a]/70 dark:text-[#bbf7d0]/70"
                  }`}
                  onClick={() => setDateMode("single")}
                >
                  Single
                </button>
                <button
                  type="button"
                  className={`rounded-full px-3 py-1 ${
                    dateMode === "range"
                      ? "bg-[#0f172a] text-[#fefce8] dark:bg-[#4ade80] dark:text-[#022c22]"
                      : "text-[#0f172a]/70 dark:text-[#bbf7d0]/70"
                  }`}
                  onClick={() => setDateMode("range")}
                >
                  Range
                </button>
              </div>
            </div>
            {dateMode === "single" ? (
              <input
                type="date"
                value={singleDate}
                onChange={(event) => setSingleDate(event.target.value)}
                className="w-full rounded-2xl border-2 border-[#0f172a] bg-white px-3 py-2 text-sm font-semibold shadow-neo-sm focus:outline-none dark:border-[#4ade80] dark:bg-black dark:text-white"
              />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={rangeFrom}
                  onChange={(event) => setRangeFrom(event.target.value)}
                  placeholder="From"
                  className="w-full rounded-2xl border-2 border-[#0f172a] bg-white px-3 py-2 text-sm font-semibold shadow-neo-sm focus:outline-none dark:border-[#4ade80] dark:bg-black dark:text-white"
                />
                <input
                  type="date"
                  value={rangeTo}
                  onChange={(event) => setRangeTo(event.target.value)}
                  placeholder="To"
                  className="w-full rounded-2xl border-2 border-[#0f172a] bg-white px-3 py-2 text-sm font-semibold shadow-neo-sm focus:outline-none dark:border-[#4ade80] dark:bg-black dark:text-white"
                />
              </div>
            )}
          </div>

          <SearchFilter
              search={searchNote}
              onSearchChange={setSearchNote}
              resultsCount={filtered.length}
            />

            <FilterSummary>
              <FilterPill
                label="All"
                active={typeFilter === "all"}
                onClick={() => setTypeFilter("all")}
              />
              <FilterPill
                label="Income"
                active={typeFilter === "income"}
                onClick={() => setTypeFilter("income")}
              />
              <FilterPill
                label="Expense"
                active={typeFilter === "expense"}
                onClick={() => setTypeFilter("expense")}
              />
            </FilterSummary>

            <SelectField
              label="Wallet"
              value={walletFilter}
              onChange={setWalletFilter}
              options={["all", ...state.wallets]}
            />
            <SelectField
              label="Category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={["all", ...state.categories]}
            />
          </div>
        )}
      </section>

      <section className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
        <div className="space-y-3">
          {groupedByDate.map((group) =>
            group.items.map((tx) => {
              const isIncome = tx.type === "income";
              return (
                <div
                  key={tx.id}
                  className={cn(
                    "rounded-2xl border-2 border-[#0f172a] px-4 py-3 shadow-neo-sm dark:border-[#4ade80]",
                    isIncome
                      ? "bg-[#dcfce7] dark:bg-[#022c22]"
                      : "bg-[#fee2e2] dark:bg-[#451a1a]",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#14532d] dark:text-[#bbf7d0]">
                      {tx.note ? `${tx.category}-${tx.note}` : tx.category}
                    </p>
                    <p
                      className={cn(
                        "text-sm font-black",
                        isIncome
                          ? "text-green-700 dark:text-green-300"
                          : "text-red-600 dark:text-red-300",
                      )}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(tx.amount, showCents)}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-[#0f172a]/70 dark:text-[#bbf7d0]/70">
                    <span>
                      {new Date(tx.date).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>{tx.wallet}</span>
                  </div>
                </div>
              );
            }),
          )}
          {!filtered.length && (
            <p className="px-6 py-12 text-center text-sm font-semibold uppercase text-[#0f172a]/40 dark:text-[#bbf7d0]/50">
              No transactions match these filters.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
