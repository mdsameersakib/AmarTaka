"use client";

import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatLocalYMD } from "@/lib/date";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  id?: string;
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  allowFuture?: boolean;
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function DatePicker({
  id,
  value,
  onChange,
  label,
  placeholder = "Select date",
  className,
  disabled,
}: DatePickerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [open, setOpen] = useState(false);

  // Parse initial year and month
  const todayStr = formatLocalYMD();
  const parsedValue = useMemo(() => {
    if (!value) return null;
    const parts = value.split("-").map(Number);
    if (parts.length < 3 || !parts[0] || !parts[1] || !parts[2]) return null;
    return { year: parts[0], month: parts[1] - 1, day: parts[2] };
  }, [value]);

  const [viewYear, setViewYear] = useState(() => {
    return parsedValue ? parsedValue.year : new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    return parsedValue ? parsedValue.month : new Date().getMonth();
  });

  const handleOpen = () => {
    if (disabled) return;
    if (parsedValue) {
      setViewYear(parsedValue.year);
      setViewMonth(parsedValue.month);
    } else {
      const now = new Date();
      setViewYear(now.getFullYear());
      setViewMonth(now.getMonth());
    }
    setOpen(true);
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Build calendar matrix
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const handleSelectDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const selectedIso = `${viewYear}-${mm}-${dd}`;
    onChange(selectedIso);
    setOpen(false);
  };

  const handleSelectPreset = (isoDate: string) => {
    onChange(isoDate);
    const parts = isoDate.split("-").map(Number);
    if (parts[0] && parts[1]) {
      setViewYear(parts[0]);
      setViewMonth(parts[1] - 1);
    }
    setOpen(false);
  };

  // Human readable label
  const formattedDisplay = useMemo(() => {
    if (!value) return placeholder;
    const parts = value.split("-").map(Number);
    if (parts.length < 3 || !parts[0] || !parts[1] || !parts[2]) return value;
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [value, placeholder]);

  const yesterdayStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return formatLocalYMD(d);
  }, []);

  return (
    <>
      <button
        id={inputId}
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        aria-label={label ?? "Select date"}
        className={cn(
          "btn-neo flex w-full items-center justify-between rounded-2xl border-2 border-[var(--border)] bg-white px-3.5 py-3 font-semibold shadow-neo-sm hover:bg-[var(--accent-soft)] active:scale-[0.99] transition text-left text-xs sm:text-sm text-[var(--foreground)]",
          !value && "text-[var(--foreground)] italic",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarIcon className="h-4 w-4 flex-shrink-0 text-[var(--accent-text-dark)]" />
          <span className="truncate">{formattedDisplay}</span>
        </div>
        {value === todayStr && (
          <span className="flex-shrink-0 rounded-full border border-[var(--border)] bg-[var(--accent-pill-bg)] px-2 py-0.5 text-[10px] font-black uppercase text-[var(--accent-text-dark)]">
            Today
          </span>
        )}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[92vh] rounded-t-[36px] sm:rounded-t-[44px] border-4 border-[var(--border)] bg-[var(--accent-sheet)] p-5 sm:p-6 shadow-neo-lg flex flex-col"
        >
          <SheetHeader className="flex flex-row items-center justify-between pb-2 text-left">
            <div>
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground)]">
                Custom Calendar
              </p>
              <SheetTitle className="text-xl sm:text-2xl font-black text-[var(--foreground)]">
                {label ?? "Choose Date"}
              </SheetTitle>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border-2 border-[var(--border)] bg-white p-1.5 text-[var(--foreground)] shadow-neo-sm hover:bg-[var(--accent-soft)] transition"
              aria-label="Close calendar"
            >
              <X className="h-4 w-4" />
            </button>
          </SheetHeader>

          {/* Quick preset chips */}
          <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => handleSelectPreset(todayStr)}
              className={cn(
                "flex-shrink-0 rounded-xl border-2 border-[var(--border)] px-3 py-1.5 text-xs font-black uppercase shadow-neo-sm transition",
                value === todayStr
                  ? "bg-[var(--accent-primary)] text-[var(--accent-contrast)]"
                  : "bg-white text-[var(--foreground)] hover:bg-[var(--accent-soft)]",
              )}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset(yesterdayStr)}
              className={cn(
                "flex-shrink-0 rounded-xl border-2 border-[var(--border)] px-3 py-1.5 text-xs font-black uppercase shadow-neo-sm transition",
                value === yesterdayStr
                  ? "bg-[var(--accent-primary)] text-[var(--accent-contrast)]"
                  : "bg-white text-[var(--foreground)] hover:bg-[var(--accent-soft)]",
              )}
            >
              Yesterday
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setViewYear(now.getFullYear());
                setViewMonth(now.getMonth());
              }}
              className="flex-shrink-0 flex items-center gap-1 rounded-xl border-2 border-[var(--border)]/40 bg-white/70 px-2.5 py-1.5 text-xs font-bold uppercase text-[var(--foreground)] hover:bg-white"
            >
              <RotateCcw className="h-3 w-3" /> This Month
            </button>
          </div>

          {/* Month & Year Navigation */}
          <div className="mt-4 flex items-center justify-between rounded-2xl border-2 border-[var(--border)] bg-white px-3 py-2 shadow-neo-sm">
            <button
              type="button"
              onClick={prevMonth}
              className="rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] p-2 text-[var(--foreground)] shadow-neo-sm active:scale-95 transition"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm sm:text-base font-black uppercase tracking-tight text-[var(--foreground)]">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] p-2 text-[var(--foreground)] shadow-neo-sm active:scale-95 transition"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="mt-3 grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((wd) => (
              <span
                key={wd}
                className="text-[11px] font-black uppercase text-[var(--foreground)] py-1"
              >
                {wd}
              </span>
            ))}
          </div>

          {/* Calendar day cells */}
          <div className="mt-1 grid grid-cols-7 gap-1 sm:gap-1.5 pb-4">
            {/* Previous month trailing days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => {
              const d = daysInPrevMonth - firstDayOfWeek + 1 + i;
              return (
                <div
                  key={`prev-${d}`}
                  className="flex h-10 sm:h-11 items-center justify-center text-xs font-semibold text-[var(--foreground)] select-none"
                >
                  {d}
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const mm = String(viewMonth + 1).padStart(2, "0");
              const dd = String(day).padStart(2, "0");
              const iso = `${viewYear}-${mm}-${dd}`;
              const isSelected = value === iso;
              const isToday = todayStr === iso;

              return (
                <button
                  key={`cur-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    "relative flex h-10 sm:h-11 w-full items-center justify-center rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all select-none active:scale-90",
                    isSelected
                      ? "border-2 border-[var(--border)] bg-[var(--accent-primary)] text-[var(--accent-contrast)] shadow-neo-sm scale-105 z-10"
                      : isToday
                        ? "border-2 border-[var(--border)] bg-[var(--accent-soft)] text-[var(--foreground)]"
                        : "border border-transparent bg-white text-[var(--foreground)] hover:border-[var(--border)] hover:bg-[var(--accent-soft)]",
                  )}
                >
                  {day}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
                  )}
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
