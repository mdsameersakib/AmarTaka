"use client";

import { AlertTriangle, Pencil, Trash2, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { MaskedAmount } from "@/components/ui/masked-amount";
import { Select } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { formatDisplayDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { useMoney } from "@/providers/money-provider";
import type {
  Transaction,
  TransactionInput,
  TransactionType,
} from "@/types/money";

type TransactionActionSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
};

type SheetView = "menu" | "edit" | "delete-confirm";

export function TransactionActionSheet({
  open,
  onOpenChange,
  transaction,
}: TransactionActionSheetProps) {
  const { state, updateTransaction, deleteTransaction } = useMoney();
  const [view, setView] = useState<SheetView>("menu");

  // Edit form state
  const [type, setType] = useState<TransactionType>("expense");
  const [amountStr, setAmountStr] = useState("");
  const [wallet, setWallet] = useState("");
  const [toWallet, setToWallet] = useState("");
  const [transferFee, setTransferFee] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (transaction && open) {
      setView("menu");
      setType(transaction.type);
      setAmountStr(String(transaction.amount));
      setWallet(transaction.wallet);
      setToWallet(transaction.toWallet ?? state.wallets[0] ?? "");
      setTransferFee(
        transaction.transferFee ? String(transaction.transferFee) : "",
      );
      setCategory(transaction.category);
      setDate(transaction.date);
      setNote(transaction.note ?? "");
    }
  }, [transaction, open, state.wallets]);

  if (!transaction) return null;

  const isIncome = transaction.type === "income";
  const isTransfer = transaction.type === "transfer";

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setView("menu");
    }, 300);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(val)) {
      setAmountStr(val);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number.parseFloat(amountStr);
    if (Number.isNaN(num) || num <= 0) return;

    const input: TransactionInput = {
      type,
      amount: num,
      wallet,
      category: type === "transfer" ? "Transfer" : category,
      date,
      note,
      toWallet: type === "transfer" ? toWallet : undefined,
      transferFee:
        type === "transfer" && transferFee
          ? Number.parseFloat(transferFee) || 0
          : undefined,
    };

    updateTransaction(transaction.id, input);
    handleClose();
  };

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    handleClose();
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] rounded-t-[48px] border-4 border-[var(--border)] bg-[var(--accent-subtle)] shadow-neo-lg flex flex-col overflow-y-auto"
      >
        {/* VIEW: MENU */}
        {view === "menu" && (
          <div className="flex flex-col gap-5 pb-6 pt-2">
            <SheetHeader className="text-left">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border-2 border-[var(--border)]",
                    isIncome &&
                      "bg-[#dcfce7] text-[#14532d] dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
                    !isIncome &&
                      !isTransfer &&
                      "bg-[#fee2e2] text-red-700 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
                    isTransfer &&
                      "bg-[#f0f9ff] text-blue-700 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
                  )}
                >
                  {isTransfer ? "Transfer" : isIncome ? "Income" : "Expense"}
                </span>
                <span className="text-xs font-bold text-[var(--foreground)]">
                  {formatDisplayDate(transaction.date)}
                </span>
              </div>
              <SheetTitle className="text-3xl font-black text-[var(--foreground)] mt-1">
                {transaction.category}
              </SheetTitle>
            </SheetHeader>

            {/* Amount card */}
            <div className="rounded-3xl border-3 border-[var(--border)] bg-white p-5 shadow-neo-sm">
              <p className="text-xs font-bold uppercase text-[var(--foreground)]">
                Amount
              </p>
              <p
                className={cn(
                  "text-4xl font-black mt-1",
                  isIncome && "text-green-700 dark:text-emerald-400",
                  !isIncome && !isTransfer && "text-red-600 dark:text-rose-400",
                  isTransfer && "text-blue-700 dark:text-sky-400",
                )}
              >
                <MaskedAmount
                  amount={transaction.amount}
                  prefix={isIncome ? "+" : isTransfer ? "⇄ " : "-"}
                />
              </p>
              <div className="mt-4 flex flex-col gap-1.5 text-xs text-[var(--foreground)] font-semibold border-t-2 border-[var(--border)]/10 pt-3">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-[var(--foreground)]" />
                  <span>
                    {isTransfer
                      ? `${transaction.wallet} → ${transaction.toWallet ?? "Wallet"}`
                      : `Wallet: ${transaction.wallet}`}
                  </span>
                </div>
                {transaction.note && (
                  <p className="italic text-[var(--foreground)]">
                    "{transaction.note}"
                  </p>
                )}
              </div>
            </div>

            {/* Actions Grid: Edit & Delete */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setView("edit")}
                className="btn-neo flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-[var(--border)] bg-white p-4 shadow-neo-sm hover:bg-[var(--accent-soft)] transition"
              >
                <Pencil className="h-5 w-5 text-[var(--foreground)]" />
                <span className="text-sm font-black uppercase text-[var(--foreground)]">
                  Edit
                </span>
              </button>

              <button
                type="button"
                onClick={() => setView("delete-confirm")}
                className="btn-neo flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-[var(--border)] bg-red-50 p-4 shadow-neo-sm hover:bg-red-100 transition"
              >
                <Trash2 className="h-5 w-5 text-red-600" />
                <span className="text-sm font-black uppercase text-red-600">
                  Delete
                </span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW: EDIT */}
        {view === "edit" && (
          <div className="flex flex-col gap-4 pb-6 pt-2">
            <button
              type="button"
              onClick={() => setView("menu")}
              className="self-start text-xs font-bold uppercase text-[var(--foreground)] hover:text-[var(--foreground)]"
            >
              ← Back
            </button>
            <SheetHeader className="text-left">
              <SheetTitle className="text-2xl font-black text-[var(--foreground)]">
                Edit Transaction
              </SheetTitle>
            </SheetHeader>

            <form
              onSubmit={handleSaveEdit}
              className="mt-2 flex flex-col gap-4"
            >
              {/* Type Switcher */}
              <div className="grid grid-cols-3 gap-2">
                {(["expense", "income", "transfer"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      "rounded-xl border-2 border-[var(--border)] py-2 text-xs font-black uppercase transition",
                      type === t
                        ? "bg-[var(--accent-tab)] text-[var(--accent-tab-contrast)] shadow-neo-sm"
                        : "bg-white text-[var(--foreground)] hover:bg-black/5",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Amount */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="edit-tx-amount"
                  className="text-xs font-bold uppercase text-[var(--foreground)]"
                >
                  Amount
                </label>
                <Input
                  id="edit-tx-amount"
                  type="text"
                  inputMode="decimal"
                  required
                  value={amountStr}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="rounded-2xl border-2 border-[var(--border)] bg-white px-4 py-5 text-2xl font-black shadow-neo-sm"
                />
              </div>

              {/* Wallet(s) */}
              {type === "transfer" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="edit-from-wallet"
                      className="text-xs font-bold uppercase text-[var(--foreground)]"
                    >
                      From Wallet
                    </label>
                    <Select
                      id="edit-from-wallet"
                      value={wallet}
                      onChange={(e) => setWallet(e.target.value)}
                      className="h-11 text-xs font-bold"
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
                      htmlFor="edit-to-wallet"
                      className="text-xs font-bold uppercase text-[var(--foreground)]"
                    >
                      To Wallet
                    </label>
                    <Select
                      id="edit-to-wallet"
                      value={toWallet}
                      onChange={(e) => setToWallet(e.target.value)}
                      className="h-11 text-xs font-bold"
                    >
                      {state.wallets
                        .filter((w) => w !== wallet)
                        .map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="edit-tx-wallet"
                    className="text-xs font-bold uppercase text-[var(--foreground)]"
                  >
                    Wallet
                  </label>
                  <Select
                    id="edit-tx-wallet"
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    className="h-11 text-xs font-bold"
                  >
                    {state.wallets.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              {/* Category (if not transfer) */}
              {type !== "transfer" && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase text-[var(--foreground)]">
                    Category
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {state.categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={cn(
                          "flex-shrink-0 rounded-full border-2 border-[var(--border)] px-3 py-1.5 text-xs font-black uppercase transition",
                          category === cat
                            ? "bg-[var(--accent-primary)] text-[var(--accent-contrast)] shadow-neo-sm"
                            : "bg-white text-[var(--foreground)] hover:bg-[var(--accent-soft)]",
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase text-[var(--foreground)]">
                  Date
                </span>
                <DatePicker
                  id="edit-tx-date"
                  label="Edit Transaction Date"
                  value={date}
                  onChange={setDate}
                />
              </div>

              {/* Note */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="edit-tx-note"
                  className="text-xs font-bold uppercase text-[var(--foreground)]"
                >
                  Note (optional)
                </label>
                <Textarea
                  id="edit-tx-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Description..."
                  className="min-h-[70px] rounded-2xl border-2 border-[var(--border)] bg-white px-4 py-2.5 font-semibold shadow-neo-sm"
                />
              </div>

              <Button
                type="submit"
                className="btn-neo mt-2 rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-primary)] text-[var(--accent-contrast)] py-5 text-base font-black uppercase shadow-neo-lg"
              >
                Save Changes
              </Button>
            </form>
          </div>
        )}

        {/* VIEW: DELETE CONFIRM */}
        {view === "delete-confirm" && (
          <div className="flex flex-col gap-4 pb-6 pt-2">
            <button
              type="button"
              onClick={() => setView("menu")}
              className="self-start text-xs font-bold uppercase text-[var(--foreground)] hover:text-[var(--foreground)]"
            >
              ← Back
            </button>
            <div className="flex items-center gap-3 text-red-600">
              <div className="rounded-2xl border-2 border-red-600 bg-red-100 p-2.5">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <SheetTitle className="text-2xl font-black text-[var(--foreground)]">
                Delete Transaction?
              </SheetTitle>
            </div>
            <p className="text-sm text-[var(--foreground)] mt-1">
              Are you sure you want to delete this{" "}
              <strong>{transaction.category}</strong> transaction of{" "}
              <strong>
                <MaskedAmount amount={transaction.amount} />
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setView("menu")}
                className="rounded-2xl border-2 border-[var(--border)] bg-white py-4 font-black uppercase text-[var(--foreground)]"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-2xl border-2 border-[var(--border)] bg-red-600 py-4 font-black uppercase text-[#f8fafc] shadow-neo-sm hover:bg-red-700"
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
