"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMoney } from "@/providers/money-provider";
import type { TransactionType } from "@/types/money";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import { TransactionRow } from "@/features/transactions/components/transaction-row";
import {
  FilterPill,
  FilterSummary,
  SearchFilter,
  SelectField,
} from "@/features/transactions/components/filters";

type FilterType = "all" | TransactionType;

export default function TransactionsPage() {
  const { allTransactions, totals, state, deleteTransaction, showCents } =
    useMoney();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [walletFilter, setWalletFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return allTransactions.filter((tx) => {
      const matchesType = typeFilter === "all" || tx.type === typeFilter;
      const matchesWallet =
        walletFilter === "all" || tx.wallet === walletFilter;
      const matchesCategory =
        categoryFilter === "all" || tx.category === categoryFilter;
      const matchesSearch =
        !lower ||
        tx.wallet.toLowerCase().includes(lower) ||
        tx.category.toLowerCase().includes(lower) ||
        (tx.note ?? "").toLowerCase().includes(lower);
      return matchesType && matchesWallet && matchesCategory && matchesSearch;
    });
  }, [allTransactions, typeFilter, walletFilter, categoryFilter, search]);

  const handleExport = () => {
    const rows = [
      ["Date", "Type", "Amount", "Wallet", "Category", "Note"],
      ...filtered.map((tx) => [
        tx.date,
        tx.type,
        tx.amount.toString(),
        tx.wallet,
        tx.category,
        tx.note ?? "",
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "amar-taka-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f172a]/50 dark:text-[#86efac]/80">
              Ledger
            </p>
            <h1 className="text-3xl font-black text-[#0f172a] dark:text-white">
              Transactions
            </h1>
          </div>
          <Button
            onClick={handleExport}
            className="btn-neo gap-2 rounded-2xl border-2 border-[#0f172a] bg-[#22c55e] px-5 py-3 font-black uppercase tracking-wide text-[#0f172a] shadow-neo-sm dark:border-[#4ade80] dark:bg-[#4ade80] dark:text-[#022c22]"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FilterCard
            label="Total Entries"
            value={filtered.length.toString()}
          />
          <FilterCard
            label="Balance"
            value={formatCurrency(totals.total, showCents)}
          />
          <FilterCard
            label="Income"
            value={formatCurrency(totals.income, showCents)}
            accent="income"
          />
          <FilterCard
            label="Expenses"
            value={formatCurrency(totals.expense, showCents)}
            accent="expense"
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <SearchFilter
            search={search}
            onSearchChange={setSearch}
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
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
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
      </section>

      <section className="rounded-[32px] border-4 border-[#0f172a] bg-white shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
        <div className="divide-y-2 divide-[#0f172a]/20">
          {filtered.map((tx) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              onDelete={deleteTransaction}
            />
          ))}
          {!filtered.length && (
            <p className="px-6 py-12 text-center text-sm font-semibold uppercase text-[#0f172a]/40 dark:text-[#bbf7d0]/50">
              Nothing to show with the current filters.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function FilterCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "income" | "expense";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-[#0f172a] bg-white p-4 text-left shadow-neo-sm dark:border-[#4ade80] dark:bg-[#030712]",
        accent === "income" && "bg-[#dcfce7]",
        accent === "expense" && "bg-[#fee2e2]",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f172a]/60 dark:text-[#bbf7d0]/70">
        {label}
      </p>
      <p className="text-2xl font-black text-[#0f172a] dark:text-white">
        {value}
      </p>
    </div>
  );
}
