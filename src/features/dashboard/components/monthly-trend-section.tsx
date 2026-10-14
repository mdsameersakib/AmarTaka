import { MaskedAmount } from "@/components/ui/masked-amount";
import type { TrendPoint } from "@/types/money";

type MonthlyTrendSectionProps = {
  trend: TrendPoint[];
  showCents: boolean;
  currencySymbol: string;
};

export function MonthlyTrendSection({
  trend,
  showCents,
  currencySymbol,
}: MonthlyTrendSectionProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black uppercase tracking-tight text-[#0f172a]">
          Monthly Trend
        </h2>
        <span className="rounded-full border-2 border-[#0f172a] bg-[var(--accent-pill-bg)] px-3 py-1 text-xs font-black uppercase text-[var(--accent-text-dark)] shadow-neo-sm">
          {trend.length} mo
        </span>
      </div>
      <div className="space-y-3">
        {trend.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-[#0f172a]/30 bg-[#fefce8] px-4 py-6 text-center text-xs font-semibold uppercase text-[#0f172a]/50">
            No transaction trend data yet.
          </p>
        ) : (
          trend.map((point) => (
            <div
              key={point.label}
              className="rounded-2xl border-2 border-[#0f172a] bg-[var(--accent-soft)] px-4 py-3 shadow-neo-sm"
            >
              <div className="flex items-center justify-between text-sm font-semibold uppercase text-[var(--accent-text-dark)]">
                <span>{point.label}</span>
                <span>
                  Net{" "}
                  <MaskedAmount
                    amount={point.income - point.expense}
                    showCents={showCents}
                    currencySymbol={currencySymbol}
                  />
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3 text-xs font-bold uppercase text-[#0f172a]">
                <div className="flex flex-col gap-1">
                  <span>Income</span>
                  <span className="rounded-full bg-white px-3 py-1 shadow-neo-sm">
                    <MaskedAmount
                      amount={point.income}
                      showCents={showCents}
                      currencySymbol={currencySymbol}
                    />
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span>Expense</span>
                  <span className="rounded-full bg-white px-3 py-1 shadow-neo-sm">
                    <MaskedAmount
                      amount={point.expense}
                      showCents={showCents}
                      currencySymbol={currencySymbol}
                    />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
