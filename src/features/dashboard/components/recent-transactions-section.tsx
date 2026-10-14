"use client";

import { ArrowLeftRight, MoreHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import { MaskedAmount } from "@/components/ui/masked-amount";
import { formatDateTimeDemo } from "@/features/dashboard/lib/date";
import { TransactionActionSheet } from "@/features/transactions/components/transaction-action-sheet";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/money";

type RecentTransactionsSectionProps = {
  recentTransactions: Transaction[];
  showCents: boolean;
  currencySymbol: string;
};

export function RecentTransactionsSection({
  recentTransactions,
  showCents,
  currencySymbol,
}: RecentTransactionsSectionProps) {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startCoords = useRef<{ x: number; y: number } | null>(null);
  const isLongPressTriggered = useRef(false);

  const clearLongPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startCoords.current = null;
  };

  const handlePointerDown = (tx: Transaction, e: React.PointerEvent) => {
    isLongPressTriggered.current = false;
    startCoords.current = { x: e.clientX, y: e.clientY };
    clearLongPress();
    timerRef.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      setSelectedTx(tx);
      setSheetOpen(true);
      clearLongPress();
    }, 450);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!startCoords.current) return;
    const dx = Math.abs(e.clientX - startCoords.current.x);
    const dy = Math.abs(e.clientY - startCoords.current.y);
    if (dx > 10 || dy > 10) {
      clearLongPress();
    }
  };

  const handleClick = (tx: Transaction) => {
    if (isLongPressTriggered.current) {
      isLongPressTriggered.current = false;
      return;
    }
    setSelectedTx(tx);
    setSheetOpen(true);
  };

  return (
    <>
      <div className="rounded-[28px] sm:rounded-[32px] border-3 sm:border-4 border-[#0f172a] bg-white p-4 sm:p-6 shadow-neo">
        <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-black uppercase tracking-tight text-[#0f172a]">
          Recent Transactions
        </h2>
        <div className="h-64 space-y-3 overflow-y-auto pr-3">
          {recentTransactions.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-[#0f172a]/30 bg-[var(--accent-subtle)] px-4 py-6 text-center text-xs font-semibold uppercase text-[#0f172a]/50">
              No recent transactions.
            </p>
          ) : (
            recentTransactions.map((tx) => {
              const isIncome = tx.type === "income";
              const isTransfer = tx.type === "transfer";
              return (
                // biome-ignore lint/a11y/noStaticElementInteractions: Long-press gesture container
                <div
                  key={tx.id}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleClick(tx);
                    }
                  }}
                  onPointerDown={(e) => handlePointerDown(tx, e)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={clearLongPress}
                  onPointerLeave={clearLongPress}
                  onPointerCancel={clearLongPress}
                  onClick={() => handleClick(tx)}
                  onContextMenu={(e) => e.preventDefault()}
                  className={cn(
                    "rounded-2xl border-2 border-[#0f172a] px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-neo-sm cursor-pointer select-none transition active:scale-[0.98]",
                    isTransfer ? "bg-[#f0f9ff]" : "bg-[var(--accent-subtle)]",
                  )}
                >
                  <div className="flex items-center justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {isTransfer && (
                        <ArrowLeftRight className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                      )}
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-text-dark)] truncate">
                        {tx.note ? `${tx.category} - ${tx.note}` : tx.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                      <div
                        className={cn(
                          "text-xs sm:text-sm font-black whitespace-nowrap",
                          isIncome && "text-green-700 dark:text-emerald-400",
                          !isIncome &&
                            !isTransfer &&
                            "text-red-600 dark:text-rose-400",
                          isTransfer && "text-blue-700 dark:text-sky-400",
                        )}
                      >
                        <MaskedAmount
                          amount={tx.amount}
                          showCents={showCents}
                          currencySymbol={currencySymbol}
                          prefix={isIncome ? "+" : isTransfer ? "⇄ " : "-"}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTx(tx);
                          setSheetOpen(true);
                        }}
                        className="p-1 rounded-full text-[#0f172a]/40 hover:text-[#0f172a] hover:bg-black/5 dark:hover:bg-white/10 transition"
                        aria-label="Transaction options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-[#0f172a]/70">
                    <span>{formatDateTimeDemo(tx.date)}</span>
                    <span className="truncate max-w-[130px] sm:max-w-[200px] text-right">
                      {isTransfer
                        ? `${tx.wallet} → ${tx.toWallet ?? "Wallet"}`
                        : tx.wallet}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <TransactionActionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        transaction={selectedTx}
      />
    </>
  );
}
