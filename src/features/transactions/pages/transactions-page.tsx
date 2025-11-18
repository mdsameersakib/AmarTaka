"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Filter,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMoney } from "@/providers/money-provider";
import type { Transaction, TransactionType } from "@/types/money";
import { cn } from "@/lib/utils";

type FilterType = "all" | TransactionType;

export default function TransactionsPage() {
  const { allTransactions, totals, state, deleteTransaction } = useMoney();
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
          <FilterCard label="Balance" value={formatCurrency(totals.total)} />
          <FilterCard
            label="Income"
            value={formatCurrency(totals.income)}
            accent="income"
          />
          <FilterCard
            label="Expenses"
            value={formatCurrency(totals.expense)}
            accent="expense"
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] p-4 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]">
            <div className="flex items-center gap-2 rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-2 shadow-neo-sm dark:border-[#4ade80] dark:bg-black">
              <Search className="h-4 w-4 text-[#0f172a]/60 dark:text-[#bbf7d0]" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search category, wallet, note"
                className="border-0 bg-transparent p-0 text-sm font-semibold focus-visible:ring-0"
              />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase text-[#14532d] dark:text-[#bbf7d0]">
              {filtered.length} results
            </p>
          </div>
          <div className="flex flex-wrap gap-3 rounded-2xl border-2 border-[#0f172a] bg-white p-4 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#030712]">
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
            <div className="flex-1" />
            <Filter className="h-4 w-4 text-[#0f172a]/40 dark:text-[#4ade80]" />
          </div>
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

function TransactionRow({
  transaction,
  onDelete,
}: {
  transaction: Transaction;
  onDelete: (id: number) => void;
}) {
  const isIncome = transaction.type === "income";
  const Icon = isIncome ? ArrowDownRight : ArrowUpRight;
  return (
    <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] p-3 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]">
          <Icon
            className={cn(
              "h-5 w-5",
              isIncome ? "text-green-600" : "text-red-500",
            )}
          />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase text-[#14532d] dark:text-[#bbf7d0]">
            {transaction.category} - {transaction.wallet}
          </p>
          <p className="text-xs text-[#0f172a]/60 dark:text-[#bbf7d0]/70">
            {transaction.date} - {transaction.note || "No note"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p
          className={cn(
            "text-lg font-black",
            isIncome
              ? "text-green-700 dark:text-green-300"
              : "text-red-600 dark:text-red-300",
          )}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
        <button
          type="button"
          onClick={() => onDelete(transaction.id)}
          className="rounded-full border-2 border-transparent p-2 text-[#0f172a]/40 transition hover:border-[#0f172a] hover:text-[#0f172a] dark:text-[#bbf7d0]/60"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
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

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "btn-neo rounded-2xl border-2 border-[#0f172a] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#0f172a]",
        active ? "bg-[#22c55e]" : "bg-white dark:bg-black dark:text-[#bbf7d0]",
      )}
    >
      {label}
    </button>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="flex flex-col gap-2 rounded-2xl border-2 border-[#0f172a] bg-white p-4 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#030712]">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f172a]/60 dark:text-[#bbf7d0]/60">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border-2 border-[#0f172a] bg-white px-3 py-2 font-semibold shadow-neo-sm focus:outline-none dark:border-[#4ade80] dark:bg-black dark:text-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? "All" : option}
          </option>
        ))}
      </select>
    </label>
  );
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatCurrency = (value: number) => currencyFormatter.format(value);
