import { formatCurrency } from "@/lib/currency";
import type { RecurringPayment } from "@/types/money";

type RecurringPaymentsProps = {
  recurring: RecurringPayment[];
  showCents: boolean;
  currencySymbol: string;
};

export function RecurringPayments({
  recurring,
  showCents,
  currencySymbol,
}: RecurringPaymentsProps) {
  return (
    <section className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo">
      <h2 className="text-2xl font-black text-[#0f172a] ">
        Recurring Payments
      </h2>
      <p className="text-sm text-[#0f172a]/70">
        Quick glance at your automatic debits and subscriptions.
      </p>
      <div className="mt-4 space-y-3">
        {recurring.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] px-4 py-3 shadow-neo-sm"
          >
            <div>
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
    </section>
  );
}
