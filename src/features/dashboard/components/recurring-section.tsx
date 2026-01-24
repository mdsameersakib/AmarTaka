import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import type { RecurringPayment } from "@/types/money";

type RecurringSectionProps = {
  recurring: RecurringPayment[];
  showCents: boolean;
  currencySymbol: string;
  onReset: () => void;
};

export function RecurringSection({
  recurring,
  showCents,
  currencySymbol,
  onReset,
}: RecurringSectionProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black uppercase tracking-tight text-[#0f172a] ">
          Recurring
        </h2>
        <Button
          variant="ghost"
          className="btn-neo gap-2 rounded-2xl border-2 border-transparent text-xs font-semibold uppercase text-[#0f172a]/70 hover:border-[#0f172a]"
          onClick={onReset}
        >
          <CreditCard className="sr-only h-4 w-4" />
          <span className="flex items-center gap-2">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#0f172a]/40 bg-[#fefce8] text-[10px] font-bold text-[#0f172a]/70/50/80">
              ↺
            </span>
            Reset
          </span>
        </Button>
      </div>
      <div className="space-y-3">
        {recurring.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-2xl border-2 border-[#0f172a] bg-[#fefce8] px-4 py-3 shadow-neo-sm"
          >
            <div className="rounded-2xl border-2 border-[#0f172a] bg-white p-3 shadow-neo-sm ">
              <CreditCard className="h-5 w-5 text-[#0f172a]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase text-[#14532d]">
                {item.name}
              </p>
              <p className="text-xs text-[#0f172a]/70">
                {item.date} - {item.type}
              </p>
            </div>
            <p className="text-lg font-black text-[#0f172a] ">
              {formatCurrency(item.amount, showCents, currencySymbol)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
