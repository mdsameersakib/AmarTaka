import { MaskedAmount } from "@/components/ui/masked-amount";
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
        "rounded-[24px] sm:rounded-[32px] border-3 sm:border-4 border-[var(--border)] bg-white p-3.5 sm:p-5 shadow-neo",
        accent === "income" &&
          "bg-[#dcfce7] dark:bg-[#072615] dark:border-emerald-800",
        accent === "expense" &&
          "bg-[#fee2e2] dark:bg-[#2b0d12] dark:border-rose-900",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.2em] truncate",
              accent === "income"
                ? "text-[#14532d] dark:text-emerald-400"
                : accent === "expense"
                  ? "text-red-700 dark:text-rose-400"
                  : "text-[var(--foreground)] dark:text-[#94a3b8]",
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "text-xl xs:text-2xl sm:text-3xl font-black mt-0.5 sm:mt-1 truncate",
              accent === "income"
                ? "text-[#14532d] dark:text-emerald-300"
                : accent === "expense"
                  ? "text-red-700 dark:text-rose-300"
                  : "text-[var(--foreground)] dark:text-[#f8fafc]",
            )}
          >
            <MaskedAmount
              amount={amount}
              showCents={showCents}
              currencySymbol={currencySymbol}
            />
          </p>
        </div>
      </div>
      {pill ? (
        <span className="mt-3 sm:mt-4 inline-flex rounded-full bg-[var(--foreground)] text-[var(--background)] px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold uppercase shadow-neo-sm">
          {pill}
        </span>
      ) : null}
    </div>
  );
}
