"use client";

import { ArrowDownRight, ArrowLeftRight, ArrowUpRight, X } from "lucide-react";
import { MaskedAmount } from "@/components/ui/masked-amount";
import { formatDisplayDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/money";

type TransactionRowProps = {
  transaction: Transaction;
  onDelete: (id: number) => void;
};

export function TransactionRow({ transaction, onDelete }: TransactionRowProps) {
  const isIncome = transaction.type === "income";
  const isTransfer = transaction.type === "transfer";

  return (
    <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-soft)] p-3 shadow-neo-sm">
          {isTransfer ? (
            <ArrowLeftRight className="h-5 w-5 text-blue-600" />
          ) : isIncome ? (
            <ArrowDownRight className="h-5 w-5 text-green-600" />
          ) : (
            <ArrowUpRight className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase text-[var(--accent-text-dark)]">
            {isTransfer
              ? `${transaction.wallet} → ${transaction.toWallet ?? "Wallet"}`
              : `${transaction.category} - ${transaction.wallet}`}
          </p>
          <p className="text-xs text-[var(--foreground)]">
            {formatDisplayDate(transaction.date)} -{" "}
            {transaction.note || "No note"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "text-lg font-black",
            isIncome && "text-green-700",
            !isIncome && !isTransfer && "text-red-600",
            isTransfer && "text-blue-700",
          )}
        >
          <MaskedAmount
            amount={transaction.amount}
            prefix={isIncome ? "+" : isTransfer ? "⇄ " : "-"}
          />
        </div>
        <button
          type="button"
          onClick={() => onDelete(transaction.id)}
          className="rounded-full border-2 border-transparent p-2 text-[var(--foreground)] transition hover:border-[var(--border)] hover:text-[var(--foreground)]"
          aria-label="Delete transaction"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
