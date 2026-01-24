import { formatDateTimeDemo } from "@/features/dashboard/lib/date";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/money";

type RecentTransactionsSectionProps = {
  recentTransactions: Transaction[];
  showCents: boolean;
  currencySymbol: string;
};

export function RecentTransactionsSection({
  recentTransactions,
  showCents,
  currencySymbol,
}: RecentTransactionsSectionProps) {
  return (
    <div className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo">
      <h2 className="mb-4 text-xl font-black uppercase tracking-tight text-[#0f172a] ">
        Recent Transactions
      </h2>
      <div className="h-64 space-y-3 overflow-y-auto pr-3">
        {recentTransactions.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-[#0f172a]/30 bg-[#fefce8] px-4 py-6 text-center text-xs font-semibold uppercase text-[#0f172a]/40/40/50">
            No recent transactions.
          </p>
        ) : (
          recentTransactions.map((tx) => {
            const isIncome = tx.type === "income";
            return (
              <div
                key={tx.id}
                className="rounded-2xl border-2 border-[#0f172a] bg-[#fefce8] px-4 py-3 shadow-neo-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#14532d]">
                    {tx.note ? `${tx.category}-${tx.note}` : tx.category}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-black",
                      isIncome ? "text-green-700 " : "text-red-600 ",
                    )}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(tx.amount, showCents, currencySymbol)}
                  </p>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-[#0f172a]/70">
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
