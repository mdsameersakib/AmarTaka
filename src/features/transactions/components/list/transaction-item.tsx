import { ArrowDownRight, ArrowUpRight, X } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { useMoney } from "@/providers/money-provider";
import type { Transaction } from "@/types/money";

type TransactionItemProps = {
  transaction: Transaction;
};

export function TransactionItem({ transaction }: TransactionItemProps) {
  const { showCents, deleteTransaction } = useMoney();
  const isIncome = transaction.type === "income";
  const Icon = isIncome ? ArrowDownRight : ArrowUpRight;

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-[#0f172a] px-4 py-3 shadow-neo-sm",
        isIncome ? "bg-[#dcfce7]" : "bg-[#fee2e2]",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "rounded-full p-1 border-2 border-[#0f172a]",
              isIncome ? "bg-green-100" : "bg-red-100",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4",
                isIncome ? "text-green-600" : "text-red-500",
              )}
            />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#14532d]">
            {transaction.note
              ? `${transaction.category} - ${transaction.note}`
              : transaction.category}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p
            className={cn(
              "text-sm font-black",
              isIncome ? "text-green-700 " : "text-red-600 ",
            )}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(transaction.amount, showCents)}
          </p>
          <button
            type="button"
            onClick={() => deleteTransaction(transaction.id)}
            className="p-1 hover:bg-black/5 rounded"
          >
            <X className="h-4 w-4 opacity-50" />
          </button>
        </div>
      </div>
      <div className="mt-1 flex items-center justify-between text-[11px] text-[#0f172a]/70 pl-9">
        <span>
          {new Date(transaction.date).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
        <span>{transaction.wallet}</span>
      </div>
    </div>
  );
}
