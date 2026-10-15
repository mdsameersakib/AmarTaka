"use client";

import {
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";
import { useRef, useState } from "react";
import { MaskedAmount } from "@/components/ui/masked-amount";
import { TransactionActionSheet } from "@/features/transactions/components/transaction-action-sheet";
import { formatDisplayDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/money";

type TransactionItemProps = {
  transaction: Transaction;
};

export function TransactionItem({ transaction }: TransactionItemProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isIncome = transaction.type === "income";
  const isTransfer = transaction.type === "transfer";

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

  const handlePointerDown = (e: React.PointerEvent) => {
    isLongPressTriggered.current = false;
    startCoords.current = { x: e.clientX, y: e.clientY };
    clearLongPress();
    timerRef.current = setTimeout(() => {
      isLongPressTriggered.current = true;
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

  const handleClick = () => {
    if (isLongPressTriggered.current) {
      isLongPressTriggered.current = false;
      return;
    }
    setSheetOpen(true);
  };

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Long-press gesture container */}
      <div
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={clearLongPress}
        onPointerLeave={clearLongPress}
        onPointerCancel={clearLongPress}
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
        className={cn(
          "rounded-2xl border-2 border-[var(--border)] px-4 py-3 shadow-neo-sm cursor-pointer select-none transition active:scale-[0.98]",
          isIncome && "bg-[#dcfce7]",
          !isIncome && !isTransfer && "bg-[#fee2e2]",
          isTransfer && "bg-[#f0f9ff]",
        )}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div
              className={cn(
                "rounded-full p-1 border-2 border-[var(--border)] flex-shrink-0",
                isIncome &&
                  "bg-green-100 dark:bg-emerald-950 dark:border-emerald-800",
                !isIncome &&
                  !isTransfer &&
                  "bg-red-100 dark:bg-rose-950 dark:border-rose-800",
                isTransfer && "bg-blue-100 dark:bg-sky-950 dark:border-sky-800",
              )}
            >
              {isTransfer ? (
                <ArrowLeftRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-sky-400" />
              ) : isIncome ? (
                <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-emerald-400" />
              ) : (
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 dark:text-rose-400" />
              )}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground)] truncate">
              {transaction.note
                ? `${transaction.category} - ${transaction.note}`
                : transaction.category}
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <div
              className={cn(
                "text-xs sm:text-sm font-black whitespace-nowrap",
                isIncome && "text-green-700 dark:text-emerald-400",
                !isIncome && !isTransfer && "text-red-600 dark:text-rose-400",
                isTransfer && "text-blue-700 dark:text-sky-400",
              )}
            >
              <MaskedAmount
                amount={transaction.amount}
                prefix={isIncome ? "+" : isTransfer ? "⇄ " : "-"}
              />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSheetOpen(true);
              }}
              className="p-1 rounded-full text-[var(--foreground)] hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10 transition"
              aria-label="Transaction options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-[var(--foreground)] pl-7 sm:pl-9">
          <span>{formatDisplayDate(transaction.date)}</span>
          <span className="truncate max-w-[130px] sm:max-w-[200px] text-right">
            {isTransfer
              ? `${transaction.wallet} → ${transaction.toWallet ?? "Wallet"}`
              : transaction.wallet}
          </span>
        </div>
      </div>

      <TransactionActionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        transaction={transaction}
      />
    </>
  );
}
