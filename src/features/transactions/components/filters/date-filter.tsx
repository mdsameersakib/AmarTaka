import type { DateMode } from "@/features/transactions/hooks/use-transaction-filters";

type DateFilterProps = {
  dateMode: DateMode;
  setDateMode: (mode: DateMode) => void;
  singleDate: string;
  setSingleDate: (date: string) => void;
  rangeFrom: string;
  setRangeFrom: (date: string) => void;
  rangeTo: string;
  setRangeTo: (date: string) => void;
};

export function DateFilter({
  dateMode,
  setDateMode,
  singleDate,
  setSingleDate,
  rangeFrom,
  setRangeFrom,
  rangeTo,
  setRangeTo,
}: DateFilterProps) {
  return (
    <div className="sm:col-span-2 lg:col-span-1 space-y-3 rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] p-4 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f172a]/60 dark:text-[#bbf7d0]/70">
          Date
        </p>
        <div className="inline-flex rounded-full border-2 border-[#0f172a] bg-white p-1 text-xs font-semibold shadow-neo-sm dark:border-[#4ade80] dark:bg-black">
          <button
            type="button"
            className={`rounded-full px-3 py-1 ${
              dateMode === "all"
                ? "bg-[#0f172a] text-[#fefce8] dark:bg-[#4ade80] dark:text-[#022c22]"
                : "text-[#0f172a]/70 dark:text-[#bbf7d0]/70"
            }`}
            onClick={() => setDateMode("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 ${
              dateMode === "single"
                ? "bg-[#0f172a] text-[#fefce8] dark:bg-[#4ade80] dark:text-[#022c22]"
                : "text-[#0f172a]/70 dark:text-[#bbf7d0]/70"
            }`}
            onClick={() => setDateMode("single")}
          >
            Single
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 ${
              dateMode === "range"
                ? "bg-[#0f172a] text-[#fefce8] dark:bg-[#4ade80] dark:text-[#022c22]"
                : "text-[#0f172a]/70 dark:text-[#bbf7d0]/70"
            }`}
            onClick={() => setDateMode("range")}
          >
            Range
          </button>
        </div>
      </div>

      {dateMode === "all" && (
        <div className="w-full rounded-2xl border-2 border-[#0f172a]/20 bg-white/50 px-3 py-2 text-sm text-[#0f172a]/50 italic text-center dark:border-[#4ade80]/20 dark:bg-black/20 dark:text-[#bbf7d0]/50">
          Showing all transactions
        </div>
      )}

      {dateMode === "single" && (
        <input
          type="date"
          value={singleDate}
          onChange={(event) => setSingleDate(event.target.value)}
          className="w-full rounded-2xl border-2 border-[#0f172a] bg-white px-3 py-2 text-sm font-semibold shadow-neo-sm focus:outline-none dark:border-[#4ade80] dark:bg-black dark:text-white"
        />
      )}

      {dateMode === "range" && (
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={rangeFrom}
            onChange={(event) => setRangeFrom(event.target.value)}
            placeholder="From"
            className="w-full rounded-2xl border-2 border-[#0f172a] bg-white px-3 py-2 text-sm font-semibold shadow-neo-sm focus:outline-none dark:border-[#4ade80] dark:bg-black dark:text-white"
          />
          <input
            type="date"
            value={rangeTo}
            onChange={(event) => setRangeTo(event.target.value)}
            placeholder="To"
            className="w-full rounded-2xl border-2 border-[#0f172a] bg-white px-3 py-2 text-sm font-semibold shadow-neo-sm focus:outline-none dark:border-[#4ade80] dark:bg-black dark:text-white"
          />
        </div>
      )}
    </div>
  );
}
