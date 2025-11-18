"use client";

import { useState, type ReactNode } from "react";
import { RefreshCw, Tag, Wallet, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMoney } from "@/providers/money-provider";

export default function SettingsPage() {
  const {
    state,
    recurring,
    addCategory,
    deleteCategory,
    addWallet,
    deleteWallet,
    resetDemoData,
  } = useMoney();

  const [categoryInput, setCategoryInput] = useState("");
  const [walletInput, setWalletInput] = useState("");

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0f172a]/50 dark:text-[#86efac]/80">
          Control Center
        </p>
        <h1 className="text-3xl font-black text-[#0f172a] dark:text-white">
          Settings & Data
        </h1>
        <p className="mt-3 text-sm text-[#0f172a]/70 dark:text-[#bbf7d0]/70">
          Tune the Amar Taka data model, add new wallets or categories, and
          reset demos once you are ready to sync with a backend later.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <ManagerCard
          label="Categories"
          description="Organize recurring expense tags to keep your analytics sharp."
          icon={<Tag className="h-5 w-5" />}
          items={state.categories}
          value={categoryInput}
          onValueChange={setCategoryInput}
          onAdd={() => {
            if (!categoryInput.trim()) return;
            addCategory(categoryInput);
            setCategoryInput("");
          }}
          onDelete={deleteCategory}
        />
        <ManagerCard
          label="Wallets"
          description="Cash, cards, and fintech rails that feed your spending."
          icon={<Wallet className="h-5 w-5" />}
          items={state.wallets}
          value={walletInput}
          onValueChange={setWalletInput}
          onAdd={() => {
            if (!walletInput.trim()) return;
            addWallet(walletInput);
            setWalletInput("");
          }}
          onDelete={deleteWallet}
        />
      </section>

      <section className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
        <h2 className="text-2xl font-black text-[#0f172a] dark:text-white">
          Recurring Payments
        </h2>
        <p className="text-sm text-[#0f172a]/70 dark:text-[#bbf7d0]/70">
          Quick glance at your automatic debits and subscriptions.
        </p>
        <div className="mt-4 space-y-3">
          {recurring.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] px-4 py-3 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]"
            >
              <div>
                <p className="text-sm font-semibold uppercase text-[#14532d] dark:text-[#bbf7d0]">
                  {item.name}
                </p>
                <p className="text-xs text-[#0f172a]/70 dark:text-[#bbf7d0]/70">
                  {item.date} - {item.type}
                </p>
              </div>
              <p className="text-lg font-black text-[#0f172a] dark:text-white">
                ${item.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border-4 border-[#0f172a] bg-[#fee2e2] p-6 shadow-neo dark:border-[#f87171] dark:bg-[#450a0a]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7f1d1d] dark:text-[#fecaca]">
              Danger Zone
            </p>
            <h2 className="text-2xl font-black text-[#7f1d1d] dark:text-white">
              Reset Demo Data
            </h2>
            <p className="text-sm text-[#7f1d1d]/70 dark:text-[#fecaca]/80">
              Wipe localStorage and reload the Amar Taka demo dataset.
            </p>
          </div>
          <Button
            onClick={resetDemoData}
            className="btn-neo gap-2 rounded-2xl border-2 border-[#7f1d1d] bg-white px-5 py-3 font-black uppercase text-[#7f1d1d] shadow-neo-sm dark:border-[#fecaca] dark:bg-[#7f1d1d] dark:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </section>
    </div>
  );
}

function ManagerCard({
  label,
  description,
  icon,
  items,
  value,
  onValueChange,
  onAdd,
  onDelete,
}: {
  label: string;
  description: string;
  icon: ReactNode;
  items: string[];
  value: string;
  onValueChange: (value: string) => void;
  onAdd: () => void;
  onDelete: (value: string) => void;
}) {
  return (
    <div className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] p-3 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-black text-[#0f172a] dark:text-white">
            {label}
          </h3>
          <p className="text-xs text-[#0f172a]/70 dark:text-[#bbf7d0]/70">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-5 flex gap-3">
        <Input
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={`Add ${label.slice(0, -1)}`}
          className="rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm dark:border-[#4ade80] dark:bg-black dark:text-white"
        />
        <Button
          type="button"
          onClick={onAdd}
          className="btn-neo rounded-2xl border-2 border-[#0f172a] bg-[#22c55e] px-4 py-3 font-black uppercase text-[#0f172a] shadow-neo-sm dark:border-[#4ade80] dark:bg-[#4ade80] dark:text-[#022c22]"
        >
          Add
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] px-3 py-1 text-sm font-semibold uppercase text-[#14532d] dark:border-[#4ade80] dark:bg-[#052e16] dark:text-[#bbf7d0]"
          >
            {item}
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="rounded-full border-2 border-transparent p-1 text-xs text-[#14532d]/70 transition hover:border-[#0f172a] hover:text-[#0f172a] dark:text-[#bbf7d0]/80"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {!items.length && (
          <p className="text-xs font-semibold uppercase text-[#0f172a]/40 dark:text-[#bbf7d0]/40">
            No items yet.
          </p>
        )}
      </div>
    </div>
  );
}
