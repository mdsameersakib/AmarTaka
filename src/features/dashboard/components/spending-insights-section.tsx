import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

type SpendingRange = "week" | "month" | "year";

type SpendingCategory = {
  category: string;
  amount: number;
};

type SpendingInsightsSectionProps = {
  spendingRange: SpendingRange;
  setSpendingRange: (value: SpendingRange) => void;
  rangeFilteredSpending: SpendingCategory[];
  showCents: boolean;
};

export function SpendingInsightsSection({
  spendingRange,
  setSpendingRange,
  rangeFilteredSpending,
  showCents,
}: SpendingInsightsSectionProps) {
  return (
    <div className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo dark:border-[#4ade80] dark:bg-[#030712]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-tight text-[#0f172a] dark:text-white">
          Spending Insights
        </h2>
        <div className="inline-flex rounded-full border-2 border-[#0f172a] bg-[#fefce8] p-1 text-xs font-semibold uppercase text-[#0f172a]/70 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]">
          <button
            type="button"
            className={cn(
              "px-2 py-1 rounded-full",
              spendingRange === "week" &&
                "bg-[#0f172a] text-[#fefce8] dark:bg-[#4ade80] dark:text-[#022c22]",
            )}
            onClick={() => setSpendingRange("week")}
          >
            W
          </button>
          <button
            type="button"
            className={cn(
              "px-2 py-1 rounded-full",
              spendingRange === "month" &&
                "bg-[#0f172a] text-[#fefce8] dark:bg-[#4ade80] dark:text-[#022c22]",
            )}
            onClick={() => setSpendingRange("month")}
          >
            M
          </button>
          <button
            type="button"
            className={cn(
              "px-2 py-1 rounded-full",
              spendingRange === "year" &&
                "bg-[#0f172a] text-[#fefce8] dark:bg-[#4ade80] dark:text-[#022c22]",
            )}
            onClick={() => setSpendingRange("year")}
          >
            Y
          </button>
        </div>
      </div>

      <div className="mt-2 space-y-4">
        {rangeFilteredSpending.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-[#0f172a]/30 bg-[#fefce8] px-4 py-6 text-center text-xs font-semibold uppercase text-[#0f172a]/40 dark:border-[#4ade80]/40 dark:bg-[#052e16] dark:text-[#bbf7d0]/50">
            No spending in this range.
          </p>
        ) : (
          rangeFilteredSpending.slice(0, 4).map((category) => (
            <div key={category.category} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase text-[#14532d] dark:text-[#bbf7d0]">
                    {category.category}
                  </p>
                  <p className="text-sm font-semibold uppercase text-[#14532d] dark:text-[#bbf7d0]">
                    {formatCurrency(category.amount, showCents)}
                  </p>
                </div>
                <div className="mt-1 h-4 overflow-hidden rounded-full border-2 border-[#0f172a] bg-[#ecfccb] shadow-neo-sm dark:border-[#4ade80]">
                  <div className="h-full w-full bg-[#16a34a]" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
