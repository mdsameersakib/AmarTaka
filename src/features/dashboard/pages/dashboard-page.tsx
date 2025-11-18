"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  PlusIcon,
  RefreshCw,
  Search,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMoney } from "@/providers/money-provider";
import type {
  Transaction,
  TransactionInput,
  TransactionType,
} from "@/types/money";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

type FilterType = "all" | TransactionType;

export default function DashboardPage() {
  const {
    state,
    totals,
    walletBalances,
    spendingByCategory,
    trend,
    recentTransactions,
    allTransactions,
    recurring,
    addTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    addWallet,
    deleteWallet,
    resetDemoData,
  } = useMoney();

  const [tab, setTab] = useState<"recent" | "all">("recent");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<TransactionType>("expense");
  const [formData, setFormData] = useState<TransactionInput>({
    type: "expense",
    amount: 0,
    wallet: state.wallets[0] ?? "",
    category: state.categories[0] ?? "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [walletDialog, setWalletDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newWallet, setNewWallet] = useState("");

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

  const openForm = (type: TransactionType) => {
    setFormType(type);
    setFormData({
      type,
      amount: 0,
      wallet: state.wallets[0] ?? "",
      category: state.categories[0] ?? "",
      date: new Date().toISOString().slice(0, 10),
      note: "",
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.wallet || !formData.category || !formData.date) return;
    addTransaction({
      ...formData,
      type: formType,
      amount: Number(formData.amount),
    });
    setIsFormOpen(false);
  };

  return (
    <div className="relative mb-20 flex flex-col gap-8">
      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total Balance"
          amount={totals.total}
          icon={Wallet}
          pill="+12% vs last month"
        />
        <SummaryCard
          label="Income"
          amount={totals.income}
          icon={ArrowDownRight}
          accent="income"
        />
        <SummaryCard
          label="Expenses"
          amount={totals.expense}
          icon={ArrowUpRight}
          accent="expense"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tight text-[#0f172a] dark:text-white">
                Wallets
              </h2>
              <Button
                variant="ghost"
                className="btn-neo gap-2 rounded-2xl border-2 border-transparent text-xs font-semibold uppercase text-[#0f172a]/70 hover:border-[#0f172a]"
                onClick={() => setWalletDialog(true)}
              >
                Manage
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {walletBalances.map((wallet) => (
                <div
                  key={wallet.wallet}
                  className="rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] px-4 py-3 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]"
                >
                  <p className="text-sm font-semibold uppercase text-[#14532d] dark:text-[#bbf7d0]">
                    {wallet.wallet}
                  </p>
                  <p className="text-2xl font-black text-[#0f172a] dark:text-white">
                    {formatCurrency(wallet.balance)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tight text-[#0f172a] dark:text-white">
                Spending Insights
              </h2>
              <Button
                variant="ghost"
                className="btn-neo gap-2 rounded-2xl border-2 border-transparent text-xs font-semibold uppercase text-[#0f172a]/70 hover:border-[#0f172a]"
                onClick={() => setCategoryDialog(true)}
              >
                Categories
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              {spendingByCategory.slice(0, 4).map((category) => (
                <div
                  key={category.category}
                  className="flex items-center gap-4"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold uppercase text-[#14532d] dark:text-[#bbf7d0]">
                      {category.category}
                    </p>
                    <div className="mt-1 h-3 overflow-hidden rounded-full border-2 border-[#0f172a] bg-[#ecfccb] shadow-neo-sm dark:border-[#4ade80]">
                      <div
                        className="h-full bg-[#16a34a]"
                        style={{
                          width: `${Math.min(100, (category.amount / totals.expense) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-lg font-bold text-[#0f172a] dark:text-white">
                    {formatCurrency(category.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712] lg:col-span-2">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-tight text-[#0f172a] dark:text-white">
                Monthly Trend
              </h2>
              <span className="rounded-full bg-[#d9f99d] px-3 py-1 text-xs font-bold uppercase text-[#14532d] dark:bg-[#052e16] dark:text-[#bbf7d0]">
                {trend.length} mo
              </span>
            </div>
            <div className="space-y-3">
              {trend.map((point) => (
                <div
                  key={point.label}
                  className="rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] px-4 py-3 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]"
                >
                  <div className="flex items-center justify-between text-sm font-semibold uppercase text-[#14532d] dark:text-[#bbf7d0]">
                    <span>{point.label}</span>
                    <span>
                      Net {formatCurrency(point.income - point.expense)}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-3 text-xs font-bold uppercase text-[#0f172a] dark:text-white">
                    <div className="flex flex-col gap-1">
                      <span>Income</span>
                      <span className="rounded-full bg-white px-3 py-1 shadow-neo-sm dark:bg-black">
                        {formatCurrency(point.income)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span>Expense</span>
                      <span className="rounded-full bg-white px-3 py-1 shadow-neo-sm dark:bg-black">
                        {formatCurrency(point.expense)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-tight text-[#0f172a] dark:text-white">
                Recurring
              </h2>
              <Button
                variant="ghost"
                className="btn-neo gap-2 rounded-2xl border-2 border-transparent text-xs font-semibold uppercase text-[#0f172a]/70 hover:border-[#0f172a]"
                onClick={resetDemoData}
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
            </div>
            <div className="space-y-3">
              {recurring.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border-2 border-[#0f172a] bg-[#fefce8] px-4 py-3 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]"
                >
                  <div className="rounded-2xl border-2 border-[#0f172a] bg-white p-3 shadow-neo-sm dark:border-[#4ade80] dark:bg-black">
                    <CreditCard className="h-5 w-5 text-[#0f172a] dark:text-[#4ade80]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold uppercase text-[#14532d] dark:text-[#bbf7d0]">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#0f172a]/70 dark:text-[#bbf7d0]/70">
                      {item.date} - {item.type}
                    </p>
                  </div>
                  <p className="text-lg font-black text-[#0f172a] dark:text-white">
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#0f172a] dark:text-white">
              Transactions
            </h2>
            <p className="text-xs font-semibold uppercase text-[#0f172a]/60 dark:text-[#bbf7d0]/70">
              {visibleTransactions.length} entries
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-2xl border-2 border-[#0f172a] bg-white px-3 py-1 shadow-neo-sm dark:border-[#4ade80] dark:bg-black">
              <Search className="h-4 w-4 text-[#0f172a]/60 dark:text-[#bbf7d0]" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search notes, categories..."
                className="border-0 bg-transparent p-0 text-sm font-semibold focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] px-3 py-2 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]">
              {(["all", "income", "expense"] as FilterType[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={cn(
                    "rounded-xl px-3 py-1 text-xs font-bold uppercase transition",
                    filter === option
                      ? "bg-[#0f172a] text-white dark:bg-[#4ade80] dark:text-[#022c22]"
                      : "text-[#0f172a]/60 dark:text-[#bbf7d0]/60",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as typeof tab)}
          className="mt-6"
        >
          <TabsList className="w-full rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]">
            <TabsTrigger
              value="recent"
              className="flex-1 rounded-xl text-xs font-bold uppercase data-[state=active]:bg-white data-[state=active]:text-[#0f172a] dark:data-[state=active]:bg-black dark:data-[state=active]:text-[#bbf7d0]"
            >
              Recent
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="flex-1 rounded-xl text-xs font-bold uppercase data-[state=active]:bg-white data-[state=active]:text-[#0f172a] dark:data-[state=active]:bg-black dark:data-[state=active]:text-[#bbf7d0]"
            >
              All
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="mt-5 space-y-3">
            <TransactionList
              transactions={visibleTransactions}
              onDelete={deleteTransaction}
            />
          </TabsContent>
          <TabsContent value="all" className="mt-5 space-y-3">
            <TransactionList
              transactions={visibleTransactions}
              onDelete={deleteTransaction}
            />
          </TabsContent>
        </Tabs>
      </section>

      <button
        type="button"
        onClick={() => openForm("expense")}
        className="fab-animate fixed bottom-10 right-10 z-40 inline-flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#0f172a] bg-[#22c55e] text-[#0f172a] shadow-neo-lg dark:border-[#4ade80] dark:bg-[#4ade80] dark:text-[#022c22]"
      >
        <PlusIcon className="h-7 w-7" />
      </button>

      <AddTransactionSheet
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        formType={formType}
        setFormType={setFormType}
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
        onAdd={() => {
          if (!newCategory.trim()) return;
          addCategory(newCategory);
          setNewCategory("");
        }}
        onDelete={deleteCategory}
      />

      <ManageDialog
        title="Wallets"
        open={walletDialog}
        onOpenChange={setWalletDialog}
        items={state.wallets}
        inputValue={newWallet}
        onInputChange={setNewWallet}
        onAdd={() => {
          if (!newWallet.trim()) return;
          addWallet(newWallet);
          setNewWallet("");
        }}
        onDelete={deleteWallet}
      />
    </div>
  );
}

function SummaryCard({
  label,
  amount,
  icon: Icon,
  accent,
  pill,
}: {
  label: string;
  amount: number;
  icon: LucideIcon;
  accent?: "income" | "expense";
  pill?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[32px] border-4 border-[#0f172a] bg-white p-5 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]",
        accent === "income" && "bg-[#dcfce7]",
        accent === "expense" && "bg-[#fee2e2]",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f172a]/50 dark:text-[#bbf7d0]/70">
            {label}
          </p>
          <p className="text-3xl font-black text-[#0f172a] dark:text-white">
            {formatCurrency(amount)}
          </p>
        </div>
        <div className="rounded-2xl border-2 border-[#0f172a] bg-white p-3 shadow-neo-sm dark:border-[#4ade80] dark:bg-black">
          <Icon className="h-6 w-6 text-[#0f172a] dark:text-[#4ade80]" />
        </div>
      </div>
      {pill ? (
        <span className="mt-4 inline-flex rounded-full bg-[#0f172a] px-3 py-1 text-xs font-bold uppercase text-white shadow-neo-sm dark:bg-[#4ade80] dark:text-[#022c22]">
          {pill}
        </span>
      ) : null}
    </div>
  );
}

function TransactionList({
  transactions,
  onDelete,
}: {
  transactions: Transaction[];
  onDelete: (id: number) => void;
}) {
  if (!transactions.length) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-[#0f172a]/40 bg-[#fefce8] px-6 py-12 text-center text-sm font-semibold uppercase text-[#0f172a]/50 dark:border-[#4ade80]/50 dark:bg-[#052e16] dark:text-[#bbf7d0]/60">
        No transactions match the filter.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <TransactionRow key={tx.id} transaction={tx} onDelete={onDelete} />
      ))}
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
    <div className="flex items-center gap-4 rounded-3xl border-2 border-[#0f172a] bg-[#ecfccb] px-4 py-3 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]">
      <div className="rounded-2xl border-2 border-[#0f172a] bg-white p-3 shadow-neo-sm dark:border-[#4ade80] dark:bg-black">
        <Icon
          className={cn(
            "h-5 w-5",
            isIncome ? "text-green-600" : "text-red-500",
          )}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold uppercase text-[#14532d] dark:text-[#bbf7d0]">
          {transaction.category} - {transaction.wallet}
        </p>
        <p className="text-xs text-[#0f172a]/70 dark:text-[#bbf7d0]/70">
          {transaction.note || "No note"} - {formatDate(transaction.date)}
        </p>
      </div>
      <div className="flex items-center gap-3">
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
          aria-label="Delete transaction"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function AddTransactionSheet({
  open,
  onOpenChange,
  formType,
  setFormType,
  formData,
  setFormData,
  wallets,
  categories,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formType: TransactionType;
  setFormType: (type: TransactionType) => void;
  formData: TransactionInput;
  setFormData: (data: TransactionInput) => void;
  wallets: string[];
  categories: string[];
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-[48px] border-4 border-[#0f172a] bg-[#fefce8] shadow-neo-lg dark:border-[#4ade80] dark:bg-[#020617]"
      >
        <SheetHeader className="space-y-1 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f172a]/70 dark:text-[#86efac]">
            {formType === "income" ? "Record" : "Track"}
          </p>
          <SheetTitle className="text-3xl font-black tracking-tight text-[#0f172a] dark:text-white">
            {formType === "income" ? "New Income" : "New Expense"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            {(["income", "expense"] as TransactionType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormType(type)}
                className={cn(
                  "btn-neo rounded-3xl border-2 border-[#0f172a] px-4 py-3 text-sm font-black uppercase shadow-neo-sm transition dark:border-[#4ade80]",
                  formType === type
                    ? "bg-[#0f172a] text-white dark:bg-[#4ade80] dark:text-[#022c22]"
                    : "bg-white text-[#0f172a] dark:bg-black dark:text-[#bbf7d0]",
                )}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="tx-amount"
              className="text-xs font-bold uppercase text-[#0f172a]/70 dark:text-[#bbf7d0]/70"
            >
              Amount
            </label>
            <Input
              id="tx-amount"
              type="number"
              min="0"
              step="0.01"
              required
              value={formData.amount}
              onChange={(event) =>
                setFormData({ ...formData, amount: Number(event.target.value) })
              }
              className="rounded-3xl border-2 border-[#0f172a] bg-white px-4 py-6 text-3xl font-black shadow-neo-sm dark:border-[#4ade80] dark:bg-black dark:text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="tx-wallet"
                className="text-xs font-bold uppercase text-[#0f172a]/70 dark:text-[#bbf7d0]/70"
              >
                Wallet
              </label>
              <select
                id="tx-wallet"
                value={formData.wallet}
                onChange={(event) =>
                  setFormData({ ...formData, wallet: event.target.value })
                }
                className="w-full rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm focus:outline-none dark:border-[#4ade80] dark:bg-black dark:text-white"
                required
              >
                {wallets.map((wallet) => (
                  <option key={wallet}>{wallet}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="tx-category"
                className="text-xs font-bold uppercase text-[#0f172a]/70 dark:text-[#bbf7d0]/70"
              >
                Category
              </label>
              <select
                id="tx-category"
                value={formData.category}
                onChange={(event) =>
                  setFormData({ ...formData, category: event.target.value })
                }
                className="w-full rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm focus:outline-none dark:border-[#4ade80] dark:bg-black dark:text-white"
                required
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="tx-date"
              className="text-xs font-bold uppercase text-[#0f172a]/70 dark:text-[#bbf7d0]/70"
            >
              Date
            </label>
            <Input
              id="tx-date"
              type="date"
              required
              value={formData.date}
              onChange={(event) =>
                setFormData({ ...formData, date: event.target.value })
              }
              className="rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm dark:border-[#4ade80] dark:bg-black dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="tx-note"
              className="text-xs font-bold uppercase text-[#0f172a]/70 dark:text-[#bbf7d0]/70"
            >
              Note
            </label>
            <Textarea
              id="tx-note"
              value={formData.note}
              onChange={(event) =>
                setFormData({ ...formData, note: event.target.value })
              }
              placeholder="Add a short description"
              className="min-h-[100px] rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm dark:border-[#4ade80] dark:bg-black dark:text-white"
            />
          </div>

          <Button
            type="submit"
            className="btn-neo rounded-3xl border-2 border-[#0f172a] bg-[#22c55e] py-6 text-lg font-black uppercase tracking-wide text-[#0f172a] shadow-neo-lg dark:border-[#4ade80] dark:bg-[#4ade80] dark:text-[#022c22]"
          >
            Save Transaction
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function ManageDialog({
  title,
  open,
  onOpenChange,
  items,
  inputValue,
  onInputChange,
  onAdd,
  onDelete,
}: {
  title: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  items: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onDelete: (value: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[32px] border-4 border-[#0f172a] bg-white shadow-neo dark:border-[#4ade80] dark:bg-[#020617]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black text-[#0f172a] dark:text-white">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(event) => onInputChange(event.target.value)}
              placeholder={`New ${title.slice(0, -1)}`}
              className="rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm dark:border-[#4ade80] dark:bg-black dark:text-white"
            />
            <Button
              type="button"
              onClick={onAdd}
              className="btn-neo rounded-2xl border-2 border-[#0f172a] bg-[#22c55e] px-4 py-3 text-sm font-black uppercase text-[#0f172a] shadow-neo-sm dark:border-[#4ade80] dark:bg-[#4ade80] dark:text-[#022c22]"
            >
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] px-4 py-3 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]"
              >
                <span className="text-sm font-semibold uppercase text-[#14532d] dark:text-[#bbf7d0]">
                  {item}
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="rounded-full border-2 border-transparent p-2 text-[#0f172a]/50 transition hover:border-[#0f172a] hover:text-[#0f172a] dark:text-[#bbf7d0]/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
