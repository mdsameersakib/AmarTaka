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
        className="fab-animate fixed bottom-10 right-10 z-40 inline-flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#0f172a] bg-[#22c55e] text-[#0f172a] shadow-neo-lg"
      >
        <PlusIcon className="h-7 w-7" />
      </button>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="h-[50vh] max-h-[420px] rounded-t-[32px] border-4 border-[#0f172a] bg-white shadow-neo-lg"
        >
          <SheetTitle className="sr-only">Choose transaction type</SheetTitle>
          <div className="mx-auto mb-6 h-1.5 w-12 cursor-pointer rounded-full bg-[#e5e7eb]" />
          <h2 className="mb-6 text-center text-2xl font-black text-[#0f172a] ">
            What do you want to do?
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="btn-neo group flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-[#0f172a] bg-[#dcfce7] p-6 shadow-neo-sm hover:bg-[#bbf7d0]"
              onClick={() => {
                onSelectType("income");
                onOpenChange(false);
              }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#0f172a] bg-[#22c55e] text-white shadow-neo-sm transition-transform group-hover:scale-110">
                <ArrowDownRight className="h-8 w-8" />
              </div>
              <span className="text-lg font-bold text-[#16a34a]">
                Add Income
              </span>
            </button>
            <button
              type="button"
              className="btn-neo group flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-[#0f172a] bg-[#fee2e2] p-6 shadow-neo-sm hover:bg-[#fecaca]"
              onClick={() => {
                onSelectType("expense");
                onOpenChange(false);
              }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#0f172a] bg-[#ef4444] text-white shadow-neo-sm transition-transform group-hover:scale-110">
                <ArrowUpRight className="h-8 w-8" />
              </div>
              <span className="text-lg font-bold text-[#b91c1c]">
                Spend Money
              </span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
