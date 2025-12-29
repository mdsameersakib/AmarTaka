import { ArrowDownRight, ArrowUpRight, X } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/money";

type TransactionListProps = {
  transactions: Transaction[];
  onDelete: (id: number) => void;
};

type TransactionRowProps = {
  transaction: Transaction;
  onDelete: (id: number) => void;
};

export function TransactionList({
  transactions,
  onDelete,
}: TransactionListProps) {
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

function TransactionRow({ transaction, onDelete }: TransactionRowProps) {
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
          {transaction.note || "No note"} -{" "}
          {new Date(transaction.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
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
