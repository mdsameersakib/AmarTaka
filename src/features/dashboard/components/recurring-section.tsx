"use client";

import { CheckCircle, CreditCard } from "lucide-react";
import { useMemo } from "react";
import { MaskedAmount } from "@/components/ui/masked-amount";
import { formatLocalYMD } from "@/lib/date";
import { useMoney } from "@/providers/money-provider";

export function RecurringSection() {
  const { recurring, showCents, currencySymbol, payRecurring } = useMoney();

  const today = formatLocalYMD();

  const monthlyFixedSpendings = useMemo(() => {
    return recurring.reduce((sum, item) => {
      if (item.type !== "expense") return sum;
      if (item.frequency === "monthly") return sum + item.amount;
      if (item.frequency === "weekly") return sum + item.amount * (52 / 12);
      if (item.frequency === "yearly") return sum + item.amount / 12;
      return sum + item.amount;
    }, 0);
  }, [recurring]);

  if (recurring.length === 0) {
    return (
      <div>
        <h2 className="mb-3 text-lg font-black uppercase tracking-tight text-[#0f172a]">
          Recurring
        </h2>
        <p className="rounded-2xl border-2 border-dashed border-[#0f172a]/30 bg-[#fefce8] px-4 py-6 text-center text-xs font-semibold uppercase text-[#0f172a]/50">
          No recurring payments. Add them in Settings.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black uppercase tracking-tight text-[#0f172a]">
          Recurring
        </h2>
        {monthlyFixedSpendings > 0 && (
          <div className="flex items-center gap-1.5 rounded-full border-2 border-[#0f172a] bg-[var(--accent-pill-bg)] px-3 py-1 shadow-neo-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-text-dark)]">
              Fixed:
            </span>
            <span className="text-xs font-black text-[var(--accent-text-dark)]">
              <MaskedAmount
                amount={monthlyFixedSpendings}
                showCents={showCents}
                currencySymbol={currencySymbol}
              />
              <span className="text-[10px] opacity-75">/mo</span>
            </span>
          </div>
        )}
      </div>
      <div className="space-y-3">
        {recurring.map((item) => {
          const isDue = item.nextDueDate <= today;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border-2 border-[#0f172a] bg-[var(--accent-subtle)] px-4 py-3 shadow-neo-sm"
            >
              <div className="rounded-2xl border-2 border-[#0f172a] bg-white p-2.5 shadow-neo-sm flex-shrink-0">
                <CreditCard className="h-4 w-4 text-[#0f172a]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold uppercase text-[var(--accent-text-dark)] truncate">
                  {item.name}
                </p>
                <p
                  className={`text-xs font-semibold ${
                    isDue
                      ? "text-red-600 dark:text-red-400 font-bold"
                      : "text-[#0f172a]/60 dark:text-[#94a3b8]"
                  }`}
                >
                  {isDue ? "⚠ Due now" : `Due ${item.nextDueDate}`}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-sm font-black text-[#0f172a]">
                  <MaskedAmount
                    amount={item.amount}
                    showCents={showCents}
                    currencySymbol={currencySymbol}
                  />
                </p>
                {isDue && (
                  <button
                    type="button"
                    onClick={() => payRecurring(item.id)}
                    className="flex items-center gap-1 rounded-full border-2 border-[#0f172a] bg-[var(--accent-primary)] text-[var(--accent-contrast)] px-2.5 py-0.5 text-[10px] font-black uppercase shadow-neo-sm hover:opacity-90 active:scale-95 transition"
                  >
                    <CheckCircle className="h-3 w-3" /> Pay
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
