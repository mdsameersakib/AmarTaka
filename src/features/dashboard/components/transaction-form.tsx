"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { TransactionInput, TransactionType } from "@/types/money";

type AddTransactionSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formType: TransactionType;
  formData: TransactionInput;
  setFormData: (data: TransactionInput) => void;
  wallets: string[];
  categories: string[];
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function AddTransactionSheet({
  open,
  onOpenChange,
  formType,
  formData,
  setFormData,
  wallets,
  categories,
  onSubmit,
}: AddTransactionSheetProps) {
  const [amountStr, setAmountStr] = useState(
    formData.amount === 0 ? "" : String(formData.amount),
  );

  useEffect(() => {
    if (open) {
      setAmountStr(formData.amount === 0 ? "" : String(formData.amount));
    }
  }, [formData.amount, open]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(val)) {
      setAmountStr(val);
      const num = Number.parseFloat(val);
      setFormData({
        ...formData,
        amount: Number.isNaN(num) ? 0 : num,
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] rounded-t-[48px] border-4 border-[#0f172a] bg-[#fefce8] shadow-neo-lg flex flex-col overflow-y-auto"
      >
        <SheetHeader className="space-y-1 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f172a]/70">
            {formType === "income" ? "Record" : "Track"}
          </p>
          <SheetTitle className="text-3xl font-black tracking-tight text-[#0f172a]">
            {formType === "income" ? "New Income" : "New Expense"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5 pb-6">
          {/* Amount */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="tx-amount"
              className="text-xs font-bold uppercase text-[#0f172a]/70"
            >
              Amount
            </label>
            <Input
              id="tx-amount"
              type="text"
              inputMode="decimal"
              required
              value={amountStr}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="rounded-3xl border-2 border-[#0f172a] bg-white px-4 py-6 text-3xl font-black shadow-neo-sm"
            />
          </div>

          {/* Wallet */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="tx-wallet"
              className="text-xs font-bold uppercase text-[#0f172a]/70"
            >
              Wallet
            </label>
            <Select
              id="tx-wallet"
              value={formData.wallet}
              onChange={(e) =>
                setFormData({ ...formData, wallet: e.target.value })
              }
              className="h-12"
              required
            >
              {wallets.map((wallet) => (
                <option key={wallet}>{wallet}</option>
              ))}
            </Select>
          </div>

          {/* Category chips */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase text-[#0f172a]/70">
              Category
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={cn(
                    "flex-shrink-0 rounded-full border-2 border-[#0f172a] px-4 py-2 text-xs font-black uppercase transition",
                    formData.category === cat
                      ? "bg-[var(--accent-primary)] text-[var(--accent-contrast)] border-[var(--accent-primary)] shadow-neo-sm"
                      : "bg-white text-[#0f172a] shadow-neo-sm hover:bg-[var(--accent-soft)]",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase text-[#0f172a]/70">
              Date
            </span>
            <DatePicker
              id="tx-date"
              label="Transaction Date"
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
            />
          </div>

          {/* Note */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="tx-note"
              className="text-xs font-bold uppercase text-[#0f172a]/70"
            >
              Note
            </label>
            <Textarea
              id="tx-note"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              placeholder="Add a short description"
              className="min-h-[80px] rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm"
            />
          </div>

          <Button
            type="submit"
            className="btn-neo rounded-3xl border-2 border-[#0f172a] bg-[var(--accent-primary)] text-[var(--accent-contrast)] py-6 text-lg font-black uppercase tracking-wide shadow-neo-lg"
          >
            Save Transaction
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
