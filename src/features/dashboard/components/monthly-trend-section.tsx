import { formatCurrency } from "@/lib/currency";
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
        <h2 className="text-lg font-black uppercase tracking-tight text-[#0f172a] ">
          Monthly Trend
        </h2>
        <span className="rounded-full bg-[#d9f99d] px-3 py-1 text-xs font-bold uppercase text-[#14532d]">
          {trend.length} mo
        </span>
      </div>
      <div className="space-y-3">
        {trend.map((point) => (
          <div
            key={point.label}
            className="rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] px-4 py-3 shadow-neo-sm"
          >
            <div className="flex items-center justify-between text-sm font-semibold uppercase text-[#14532d]">
              <span>{point.label}</span>
              <span>
                Net{" "}
                {formatCurrency(
                  point.income - point.expense,
                  showCents,
                  currencySymbol,
                )}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-xs font-bold uppercase text-[#0f172a] ">
              <div className="flex flex-col gap-1">
                <span>Income</span>
                <span className="rounded-full bg-white px-3 py-1 shadow-neo-sm ">
                  {formatCurrency(point.income, showCents, currencySymbol)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span>Expense</span>
                <span className="rounded-full bg-white px-3 py-1 shadow-neo-sm ">
                  {formatCurrency(point.expense, showCents, currencySymbol)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
