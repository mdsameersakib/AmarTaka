"use client";

import { ArrowDownRight, ArrowUpRight, X } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { useMoney } from "@/providers/money-provider";
import type { Transaction } from "@/types/money";

type TransactionRowProps = {
  transaction: Transaction;
  onDelete: (id: number) => void;
};

export function TransactionRow({ transaction, onDelete }: TransactionRowProps) {
  const { showCents, currencySymbol } = useMoney();
  const isIncome = transaction.type === "income";
  const Icon = isIncome ? ArrowDownRight : ArrowUpRight;

  return (
    <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] p-3 shadow-neo-sm">
          <Icon
            className={cn(
              "h-5 w-5",
              isIncome ? "text-green-600" : "text-red-500",
            )}
          />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase text-[#14532d]">
            {transaction.category} - {transaction.wallet}
          </p>
          <p className="text-xs text-[#0f172a]/60/70">
            {transaction.date} - {transaction.note || "No note"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p
          className={cn(
            "text-lg font-black",
            isIncome ? "text-green-700 " : "text-red-600 ",
          )}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount, showCents, currencySymbol)}
        </p>
        <button
          type="button"
          onClick={() => onDelete(transaction.id)}
          className="rounded-full border-2 border-transparent p-2 text-[#0f172a]/40 transition hover:border-[#0f172a] hover:text-[#0f172a]/60"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
