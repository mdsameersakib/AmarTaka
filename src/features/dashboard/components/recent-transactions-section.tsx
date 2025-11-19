import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import type { Transaction } from "@/types/money";
import { formatDateTimeDemo } from "@/features/dashboard/lib/date";

type RecentTransactionsSectionProps = {
  recentTransactions: Transaction[];
  showCents: boolean;
};

export function RecentTransactionsSection({
  recentTransactions,
  showCents,
}: RecentTransactionsSectionProps) {
  return (
    <div className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
      <h2 className="mb-4 text-xl font-black uppercase tracking-tight text-[#0f172a] dark:text-white">
        Recent Transactions
      </h2>
      <div className="h-64 space-y-3 overflow-y-auto pr-3">
        {recentTransactions.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-[#0f172a]/30 bg-[#fefce8] px-4 py-6 text-center text-xs font-semibold uppercase text-[#0f172a]/40 dark:border-[#4ade80]/40 dark:bg-[#052e16] dark:text-[#bbf7d0]/50">
            No recent transactions.
          </p>
        ) : (
          recentTransactions.map((tx) => {
            const isIncome = tx.type === "income";
            return (
              <div
                key={tx.id}
                className="rounded-2xl border-2 border-[#0f172a] bg-[#fefce8] px-4 py-3 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#14532d] dark:text-[#bbf7d0]">
                    {tx.note ? `${tx.category}-${tx.note}` : tx.category}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-black",
                      isIncome
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-600 dark:text-red-300",
                    )}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(tx.amount, showCents)}
                  </p>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-[#0f172a]/70 dark:text-[#bbf7d0]/70">
                  <span>{formatDateTimeDemo(tx.date)}</span>
                  <span>{tx.wallet}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

