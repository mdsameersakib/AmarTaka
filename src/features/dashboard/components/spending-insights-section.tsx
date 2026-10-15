import { MaskedAmount } from "@/components/ui/masked-amount";
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
  currencySymbol: string;
};

export function SpendingInsightsSection({
  spendingRange,
  setSpendingRange,
  rangeFilteredSpending,
  showCents,
  currencySymbol,
}: SpendingInsightsSectionProps) {
  const maxAmount = Math.max(
    ...rangeFilteredSpending.map((category) => category.amount),
    1,
  );

  return (
    <div className="rounded-[28px] sm:rounded-[32px] border-3 sm:border-4 border-[var(--border)] bg-white p-4 sm:p-6 shadow-neo">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[var(--foreground)]">
          Spending Insights
        </h2>
        <div className="inline-flex rounded-full border-2 border-[var(--border)] bg-[#fefce8] p-1 text-xs font-semibold uppercase text-[var(--foreground)] shadow-neo-sm">
          <button
            type="button"
            className={cn(
              "px-2 py-1 rounded-full",
              spendingRange === "week" &&
                "bg-[var(--foreground)] text-[#fefce8] dark:bg-[var(--accent-primary)] dark:text-[var(--accent-contrast)]",
            )}
            onClick={() => setSpendingRange("week")}
            aria-label="Show week spending"
            aria-pressed={spendingRange === "week"}
          >
            W
          </button>
          <button
            type="button"
            className={cn(
              "px-2 py-1 rounded-full",
              spendingRange === "month" &&
                "bg-[var(--foreground)] text-[#fefce8] dark:bg-[var(--accent-primary)] dark:text-[var(--accent-contrast)]",
            )}
            onClick={() => setSpendingRange("month")}
            aria-label="Show month spending"
            aria-pressed={spendingRange === "month"}
          >
            M
          </button>
          <button
            type="button"
            className={cn(
              "px-2 py-1 rounded-full",
              spendingRange === "year" &&
                "bg-[var(--foreground)] text-[#fefce8] dark:bg-[var(--accent-primary)] dark:text-[var(--accent-contrast)]",
            )}
            onClick={() => setSpendingRange("year")}
            aria-label="Show year spending"
            aria-pressed={spendingRange === "year"}
          >
            Y
          </button>
        </div>
      </div>

      <div className="mt-2 space-y-4">
        {rangeFilteredSpending.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-[var(--border)]/30 bg-[#fefce8] px-4 py-6 text-center text-xs font-semibold uppercase text-[var(--foreground)]">
            No spending in this range.
          </p>
        ) : (
          rangeFilteredSpending.slice(0, 4).map((category) => (
            <div key={category.category} className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase text-[var(--accent-text-dark)]">
                    {category.category}
                  </p>
                  <p className="text-sm font-semibold uppercase text-[var(--accent-text-dark)]">
                    <MaskedAmount
                      amount={category.amount}
                      showCents={showCents}
                      currencySymbol={currencySymbol}
                    />
                  </p>
                </div>
                <div className="mt-1 h-4 overflow-hidden rounded-full border-2 border-[var(--border)] bg-[var(--accent-soft)] shadow-neo-sm">
                  <div
                    className="h-full bg-[var(--accent-primary)] transition-all"
                    style={{
                      width: `${Math.max((category.amount / maxAmount) * 100, 4)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
