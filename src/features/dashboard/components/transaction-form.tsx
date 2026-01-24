"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
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
        className="max-h-[85vh] rounded-t-[48px] border-4 border-[#0f172a] bg-[#fefce8] shadow-neo-lg flex flex-col overflow-y-auto"
      >
        <SheetHeader className="space-y-1 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f172a]/70">
            {formType === "income" ? "Record" : "Track"}
          </p>
          <SheetTitle className="text-3xl font-black tracking-tight text-[#0f172a] ">
            {formType === "income" ? "New Income" : "New Expense"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5 pb-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="tx-amount"
              className="text-xs font-bold uppercase text-[#0f172a]/70"
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
              className="rounded-3xl border-2 border-[#0f172a] bg-white px-4 py-6 text-3xl font-black shadow-neo-sm  "
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
                onChange={(event) =>
                  setFormData({ ...formData, wallet: event.target.value })
                }
                className="h-12"
                required
              >
                {wallets.map((wallet) => (
                  <option key={wallet}>{wallet}</option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="tx-category"
                className="text-xs font-bold uppercase text-[#0f172a]/70"
              >
                Category
              </label>
              <Select
                id="tx-category"
                value={formData.category}
                onChange={(event) =>
                  setFormData({ ...formData, category: event.target.value })
                }
                className="h-12"
                required
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="tx-date"
              className="text-xs font-bold uppercase text-[#0f172a]/70"
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
              className="rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm  "
            />
          </div>

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
              onChange={(event) =>
                setFormData({ ...formData, note: event.target.value })
              }
              placeholder="Add a short description"
              className="min-h-[100px] rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-3 font-semibold shadow-neo-sm  "
            />
          </div>

          <Button
            type="submit"
            className="btn-neo rounded-3xl border-2 border-[#0f172a] bg-[#22c55e] py-6 text-lg font-black uppercase tracking-wide text-[#0f172a] shadow-neo-lg"
          >
            Save Transaction
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
