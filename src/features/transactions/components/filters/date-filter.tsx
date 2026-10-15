import { DatePicker } from "@/components/ui/date-picker";
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
    <div className="sm:col-span-2 lg:col-span-1 space-y-3 rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-soft)] p-4 shadow-neo-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]">
          Date
        </p>
        <div className="inline-flex rounded-full border-2 border-[var(--border)] bg-white p-1 text-xs font-semibold shadow-neo-sm ">
          <button
            type="button"
            className={`rounded-full px-3 py-1 ${
              dateMode === "all"
                ? "bg-[var(--foreground)] text-[#fefce8] dark:bg-[var(--accent-primary)] dark:text-[var(--accent-contrast)]"
                : "text-[var(--foreground)] hover:text-[var(--foreground)]"
            }`}
            onClick={() => setDateMode("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 ${
              dateMode === "single"
                ? "bg-[var(--foreground)] text-[#fefce8] dark:bg-[var(--accent-primary)] dark:text-[var(--accent-contrast)]"
                : "text-[var(--foreground)] hover:text-[var(--foreground)]"
            }`}
            onClick={() => setDateMode("single")}
          >
            Single
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 ${
              dateMode === "range"
                ? "bg-[var(--foreground)] text-[#fefce8] dark:bg-[var(--accent-primary)] dark:text-[var(--accent-contrast)]"
                : "text-[var(--foreground)] hover:text-[var(--foreground)]"
            }`}
            onClick={() => setDateMode("range")}
          >
            Range
          </button>
        </div>
      </div>

      {dateMode === "all" && (
        <div className="w-full rounded-2xl border-2 border-[var(--border)]/20 bg-white/50 px-3 py-2 text-sm text-[var(--foreground)] italic text-center">
          Showing all transactions
        </div>
      )}

      {dateMode === "single" && (
        <DatePicker
          label="Filter by Date"
          value={singleDate}
          onChange={setSingleDate}
          placeholder="Pick a date"
        />
      )}

      {dateMode === "range" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <DatePicker
            label="From Date"
            value={rangeFrom}
            onChange={setRangeFrom}
            placeholder="From date"
          />
          <DatePicker
            label="To Date"
            value={rangeTo}
            onChange={setRangeTo}
            placeholder="To date"
          />
        </div>
      )}
    </div>
  );
}
