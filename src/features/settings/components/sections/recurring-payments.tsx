"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { MaskedAmount } from "@/components/ui/masked-amount";
import { RecurringFormSheet } from "@/features/settings/components/sections/recurring-form-sheet";
import { formatLocalYMD } from "@/lib/date";
import { useMoney } from "@/providers/money-provider";
import type { RecurringPayment } from "@/types/money";

export function RecurringPayments() {
  const { recurring, showCents, currencySymbol, deleteRecurring } = useMoney();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringPayment | null>(null);

  const today = formatLocalYMD();

  const getDueStatus = (nextDueDate: string) => {
    if (nextDueDate <= today) return "overdue";
    const diff = Math.ceil(
      (new Date(nextDueDate).getTime() - Date.now()) / 86400000,
    );
    if (diff <= 5) return "soon";
    return "ok";
  };

  return (
    <section className="rounded-[32px] border-4 border-[var(--border)] bg-white p-6 shadow-neo">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">
            Recurring Payments
          </h2>
          <p className="text-sm text-[var(--foreground)]">
            Subscriptions, bills, and regular income.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="btn-neo flex items-center gap-1 rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-primary)] text-[var(--accent-contrast)] px-4 py-2 text-xs font-black uppercase shadow-neo-sm hover:opacity-90 active:scale-95 transition"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      <div className="space-y-3">
        {recurring.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-[var(--border)]/30 bg-[#fefce8] px-4 py-6 text-center text-xs font-semibold uppercase text-[var(--foreground)]">
            No recurring payments yet.
          </p>
        ) : (
          recurring.map((item) => {
            const status = getDueStatus(item.nextDueDate);
            return (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-soft)] px-4 py-3 shadow-neo-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold uppercase text-[var(--accent-text-dark)] truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[var(--foreground)]">
                      {item.frequency} · {item.walletName}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        status === "overdue"
                          ? "bg-red-100 text-red-700"
                          : status === "soon"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-white text-[var(--foreground)]"
                      }`}
                    >
                      Due {item.nextDueDate}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <p className="text-sm font-black text-[var(--foreground)]">
                    <MaskedAmount
                      amount={item.amount}
                      showCents={showCents}
                      currencySymbol={currencySymbol}
                    />
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(item);
                      setFormOpen(true);
                    }}
                    className="rounded-full border-2 border-transparent p-1.5 text-[var(--foreground)] hover:border-[var(--border)] hover:text-[var(--foreground)]"
                    aria-label={`Edit ${item.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRecurring(item.id)}
                    className="rounded-full border-2 border-transparent p-1.5 text-red-400 hover:border-red-300 hover:text-red-600"
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <RecurringFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
      />
    </section>
  );
}
