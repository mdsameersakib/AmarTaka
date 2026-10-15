"use client";

import { ArrowDownRight, ArrowUpRight, PlusIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { TransactionType } from "@/types/money";

type FloatingActionLauncherProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectType: (type: TransactionType) => void;
};

export function FloatingActionLauncher({
  open,
  onOpenChange,
  onSelectType,
}: FloatingActionLauncherProps) {
  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="fab-animate fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-3 sm:border-4 border-[var(--border)] bg-[var(--accent-primary)] text-[var(--accent-contrast)] shadow-neo-lg active:scale-90 transition"
      >
        <PlusIcon className="h-6 w-6 sm:h-7 sm:w-7" />
      </button>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="h-[50vh] max-h-[420px] rounded-t-[32px] border-4 border-[var(--border)] bg-white shadow-neo-lg"
        >
          <SheetTitle className="sr-only">Choose transaction type</SheetTitle>
          <div className="mx-auto mb-6 h-1.5 w-12 cursor-pointer rounded-full bg-[#e5e7eb] dark:bg-slate-700" />
          <h2 className="mb-6 text-center text-2xl font-black text-[var(--foreground)]">
            What do you want to do?
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="btn-neo group flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-[var(--border)] bg-[#dcfce7] dark:bg-[#062816] p-6 shadow-neo-sm hover:bg-[#bbf7d0] dark:hover:bg-[#0c3820]"
              onClick={() => {
                onSelectType("income");
                onOpenChange(false);
              }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[#22c55e] text-[#f8fafc] dark:text-[#052e16] shadow-neo-sm transition-transform group-hover:scale-110">
                <ArrowDownRight className="h-8 w-8" />
              </div>
              <span className="text-lg font-bold text-[#16a34a] dark:text-[#4ade80]">
                Add Income
              </span>
            </button>
            <button
              type="button"
              className="btn-neo group flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-[var(--border)] bg-[#fee2e2] dark:bg-[#2b0d12] p-6 shadow-neo-sm hover:bg-[#fecaca] dark:hover:bg-[#3d131a]"
              onClick={() => {
                onSelectType("expense");
                onOpenChange(false);
              }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[#ef4444] text-[#f8fafc] dark:text-[#450a0a] shadow-neo-sm transition-transform group-hover:scale-110">
                <ArrowUpRight className="h-8 w-8" />
              </div>
              <span className="text-lg font-bold text-[#b91c1c] dark:text-[#f87171]">
                Spend Money
              </span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
