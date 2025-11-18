"use client";

import { useState } from "react";
import { RefreshCw, Tag, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMoney } from "@/providers/money-provider";
import { ManagerCard } from "@/features/settings/components/manager-card";

export default function SettingsPage() {
  const {
    state,
    recurring,
    addCategory,
    deleteCategory,
    addWallet,
    deleteWallet,
    resetDemoData,
    showCents,
    toggleShowCents,
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
        <div className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
          <h2 className="text-xl font-black text-[#0f172a] dark:text-white">
            Display
          </h2>
          <p className="text-xs text-[#0f172a]/70 dark:text-[#bbf7d0]/70">
            Control how amounts are rendered across Amar Taka.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] px-4 py-3 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]">
            <div>
              <p className="text-sm font-semibold uppercase text-[#14532d] dark:text-[#bbf7d0]">
                Show cents
              </p>
              <p className="text-xs text-[#0f172a]/70 dark:text-[#bbf7d0]/70">
                Toggle between whole amounts and two decimal places.
              </p>
            </div>
            <Button
              type="button"
              onClick={toggleShowCents}
              className={
                showCents
                  ? "btn-neo rounded-2xl border-2 border-[#0f172a] bg-[#22c55e] px-4 py-2 text-xs font-black uppercase text-[#0f172a] shadow-neo-sm dark:border-[#4ade80] dark:bg-[#4ade80] dark:text-[#022c22]"
                  : "btn-neo rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-2 text-xs font-black uppercase text-[#0f172a] shadow-neo-sm dark:border-[#4ade80] dark:bg-black dark:text-[#bbf7d0]"
              }
            >
              {showCents ? "On" : "Off"}
            </Button>
          </div>
        </div>

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
