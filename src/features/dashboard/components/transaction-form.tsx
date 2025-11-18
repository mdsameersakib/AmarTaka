"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
