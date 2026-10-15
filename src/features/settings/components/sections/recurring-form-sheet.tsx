"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMoney } from "@/providers/money-provider";
import type {
  RecurringFrequency,
  RecurringPayment,
  TransactionType,
} from "@/types/money";

type RecurringFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: RecurringPayment | null;
};

const DAYS_OF_MONTH = Array.from({ length: 28 }, (_, i) => i + 1);

export function RecurringFormSheet({
  open,
  onOpenChange,
  editing,
}: RecurringFormSheetProps) {
  const { state, addRecurring, updateRecurring } = useMoney();

  const defaultWallet = state.wallets[0] ?? "";
  const defaultCategory = state.categories[0] ?? "";

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<RecurringFrequency>("monthly");
  const [dueDay, setDueDay] = useState(1);
  const [walletName, setWalletName] = useState(defaultWallet);
  const [category, setCategory] = useState(defaultCategory);
  const [type, setType] = useState<TransactionType>("expense");

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setAmount(String(editing.amount));
      setFrequency(editing.frequency);
      setDueDay(editing.dueDay);
      setWalletName(editing.walletName);
      setCategory(editing.category);
      setType(editing.type);
    } else {
      setName("");
      setAmount("");
      setFrequency("monthly");
      setDueDay(1);
      setWalletName(defaultWallet);
      setCategory(defaultCategory);
      setType("expense");
    }
  }, [editing, defaultWallet, defaultCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number.parseFloat(amount);
    if (!name.trim() || Number.isNaN(amt) || amt <= 0) return;
    const payload = {
      name: name.trim(),
      amount: amt,
      frequency,
      dueDay,
      walletName,
      category,
      type,
      lastPaidDate: editing?.lastPaidDate ?? null,
    };
    if (editing) {
      updateRecurring(editing.id, payload);
    } else {
      addRecurring(payload);
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] rounded-t-[48px] border-4 border-[var(--border)] bg-[#fefce8] shadow-neo-lg flex flex-col overflow-y-auto"
      >
        <SheetHeader className="space-y-1 text-left">
          <SheetTitle className="text-3xl font-black tracking-tight text-[var(--foreground)]">
            {editing ? "Edit Recurring" : "New Recurring"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 pb-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="rec-name"
              className="text-xs font-bold uppercase text-[var(--foreground)]"
            >
              Name
            </label>
            <Input
              id="rec-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Netflix, WiFi"
              required
              className="rounded-2xl border-2 border-[var(--border)] bg-white px-4 py-3 font-semibold shadow-neo-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="rec-amount"
                className="text-xs font-bold uppercase text-[var(--foreground)]"
              >
                Amount
              </label>
              <Input
                id="rec-amount"
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="rounded-2xl border-2 border-[var(--border)] bg-white px-4 py-3 font-semibold shadow-neo-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="rec-type"
                className="text-xs font-bold uppercase text-[var(--foreground)]"
              >
                Type
              </label>
              <Select
                id="rec-type"
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
                className="h-12"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="rec-freq"
                className="text-xs font-bold uppercase text-[var(--foreground)]"
              >
                Frequency
              </label>
              <Select
                id="rec-freq"
                value={frequency}
                onChange={(e) =>
                  setFrequency(e.target.value as RecurringFrequency)
                }
                className="h-12"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="rec-dueday"
                className="text-xs font-bold uppercase text-[var(--foreground)]"
              >
                {frequency === "weekly" ? "Day of week" : "Day of month"}
              </label>
              {frequency === "weekly" ? (
                <Select
                  id="rec-dueday"
                  value={String(dueDay)}
                  onChange={(e) => setDueDay(Number(e.target.value))}
                  className="h-12"
                >
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d, i) => (
                      <option key={d} value={i}>
                        {d}
                      </option>
                    ),
                  )}
                </Select>
              ) : (
                <Select
                  id="rec-dueday"
                  value={String(dueDay)}
                  onChange={(e) => setDueDay(Number(e.target.value))}
                  className="h-12"
                >
                  {DAYS_OF_MONTH.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="rec-wallet"
                className="text-xs font-bold uppercase text-[var(--foreground)]"
              >
                Wallet
              </label>
              <Select
                id="rec-wallet"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                className="h-12"
              >
                {state.wallets.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="rec-cat"
                className="text-xs font-bold uppercase text-[var(--foreground)]"
              >
                Category
              </label>
              <Select
                id="rec-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12"
              >
                {state.categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="btn-neo rounded-3xl border-2 border-[var(--border)] bg-[var(--accent-primary)] text-[var(--accent-contrast)] py-6 text-lg font-black uppercase tracking-wide shadow-neo-lg mt-2"
          >
            {editing ? "Update" : "Add Recurring"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
