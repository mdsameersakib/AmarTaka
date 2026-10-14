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
        "rounded-[32px] border-4 border-[#0f172a] bg-white p-5 shadow-neo",
        accent === "income" &&
          "bg-[#dcfce7] dark:bg-[#072615] dark:border-emerald-800",
        accent === "expense" &&
          "bg-[#fee2e2] dark:bg-[#2b0d12] dark:border-rose-900",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.2em]",
              accent === "income"
                ? "text-[#14532d] dark:text-emerald-400"
                : accent === "expense"
                  ? "text-red-700 dark:text-rose-400"
                  : "text-[#0f172a]/70 dark:text-[#94a3b8]",
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "text-3xl font-black mt-1",
              accent === "income"
                ? "text-[#14532d] dark:text-emerald-300"
                : accent === "expense"
                  ? "text-red-700 dark:text-rose-300"
                  : "text-[#0f172a] dark:text-[#f8fafc]",
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
        <span className="mt-4 inline-flex rounded-full bg-[#0f172a] text-white dark:bg-white dark:text-[#0f172a] px-3 py-1 text-xs font-bold uppercase shadow-neo-sm">
          {pill}
        </span>
      ) : null}
    </div>
  );
}
