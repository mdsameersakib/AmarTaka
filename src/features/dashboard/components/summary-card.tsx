import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

type SummaryCardProps = {
  label: string;
  amount: number;
  accent?: "income" | "expense";
  pill?: string;
  showCents: boolean;
  currencySymbol: string;
};

export function SummaryCard({
  label,
  amount,
  accent,
  pill,
  showCents,
  currencySymbol,
}: SummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-[32px] border-4 border-[#0f172a] bg-white p-5 shadow-neo",
        accent === "income" && "bg-[#dcfce7]",
        accent === "expense" && "bg-[#fee2e2]",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f172a]/50/70">
            {label}
          </p>
          <p className="text-3xl font-black text-[#0f172a] ">
            {formatCurrency(amount, showCents, currencySymbol)}
          </p>
        </div>
      </div>
      {pill ? (
        <span className="mt-4 inline-flex rounded-full bg-[#0f172a] px-3 py-1 text-xs font-bold uppercase text-white shadow-neo-sm">
          {pill}
        </span>
      ) : null}
    </div>
  );
}
