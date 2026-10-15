import { Laptop, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type DisplaySettingsProps = {
  showCents: boolean;
  onToggleCents: () => void;
  currencySymbol: string;
  onSetCurrencySymbol: (value: string) => void;
  balanceHidden: boolean;
  onToggleBalanceHidden: () => void;
  themeMode: "light" | "dark" | "system";
  onSetThemeMode: (mode: "light" | "dark" | "system") => void;
};

const CURRENCY_OPTIONS = [
  { code: "BDT", symbol: "৳" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "INR", symbol: "₹" },
  { code: "SAR", symbol: "﷼" },
  { code: "MYR", symbol: "RM" },
];

export function DisplaySettings({
  showCents,
  onToggleCents,
  currencySymbol,
  onSetCurrencySymbol,
  balanceHidden,
  onToggleBalanceHidden,
  themeMode,
  onSetThemeMode,
}: DisplaySettingsProps) {
  return (
    <div className="rounded-[32px] border-4 border-[var(--border)] bg-white p-6 shadow-neo">
      <h2 className="text-xl font-black text-[var(--foreground)]">Display</h2>
      <p className="text-xs text-[var(--foreground)]">
        Control appearance and how amounts are rendered.
      </p>

      {/* Theme mode */}
      <div className="mt-4 flex flex-col gap-3 rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-soft)] px-4 py-3 shadow-neo-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-[var(--accent-text-dark)]">
            Appearance
          </p>
          <p className="text-xs text-[var(--foreground)]">
            Light, dark, or system preference.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onSetThemeMode("light")}
            className={cn(
              "btn-neo flex items-center justify-center gap-1.5 rounded-xl border-2 border-[var(--border)] px-3 py-2 text-xs font-black uppercase transition shadow-neo-sm",
              themeMode === "light"
                ? "bg-[var(--accent-primary)] text-[var(--accent-contrast)]"
                : "bg-white text-[var(--foreground)] hover:bg-black/5",
            )}
          >
            <Sun className="h-3.5 w-3.5" /> Light
          </button>
          <button
            type="button"
            onClick={() => onSetThemeMode("dark")}
            className={cn(
              "btn-neo flex items-center justify-center gap-1.5 rounded-xl border-2 border-[var(--border)] px-3 py-2 text-xs font-black uppercase transition shadow-neo-sm",
              themeMode === "dark"
                ? "bg-[var(--accent-primary)] text-[var(--accent-contrast)]"
                : "bg-white text-[var(--foreground)] hover:bg-black/5",
            )}
          >
            <Moon className="h-3.5 w-3.5" /> Dark
          </button>
          <button
            type="button"
            onClick={() => onSetThemeMode("system")}
            className={cn(
              "btn-neo flex items-center justify-center gap-1.5 rounded-xl border-2 border-[var(--border)] px-3 py-2 text-xs font-black uppercase transition shadow-neo-sm",
              themeMode === "system"
                ? "bg-[var(--accent-primary)] text-[var(--accent-contrast)]"
                : "bg-white text-[var(--foreground)] hover:bg-black/5",
            )}
          >
            <Laptop className="h-3.5 w-3.5" /> Auto
          </button>
        </div>
      </div>

      {/* Show cents */}
      <div className="mt-3 flex items-center justify-between rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-soft)] px-4 py-3 shadow-neo-sm">
        <div>
          <p className="text-sm font-semibold uppercase text-[var(--accent-text-dark)]">
            Show cents
          </p>
          <p className="text-xs text-[var(--foreground)]">Toggle decimal places.</p>
        </div>
        <Button
          type="button"
          onClick={onToggleCents}
          className={
            showCents
              ? "btn-neo rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-primary)] text-[var(--accent-contrast)] px-4 py-2 text-xs font-black uppercase shadow-neo-sm"
              : "btn-neo rounded-2xl border-2 border-[var(--border)] bg-white px-4 py-2 text-xs font-black uppercase text-[var(--foreground)] shadow-neo-sm"
          }
        >
          {showCents ? "On" : "Off"}
        </Button>
      </div>

      {/* Privacy mode */}
      <div className="mt-3 flex items-center justify-between rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-soft)] px-4 py-3 shadow-neo-sm">
        <div>
          <p className="text-sm font-semibold uppercase text-[var(--accent-text-dark)]">
            Privacy mode
          </p>
          <p className="text-xs text-[var(--foreground)]">
            Hide all balances from view.
          </p>
        </div>
        <Button
          type="button"
          onClick={onToggleBalanceHidden}
          className={
            balanceHidden
              ? "btn-neo rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-primary)] text-[var(--accent-contrast)] px-4 py-2 text-xs font-black uppercase shadow-neo-sm"
              : "btn-neo rounded-2xl border-2 border-[var(--border)] bg-white px-4 py-2 text-xs font-black uppercase text-[var(--foreground)] shadow-neo-sm"
          }
        >
          {balanceHidden ? "On" : "Off"}
        </Button>
      </div>

      {/* Currency */}
      <div className="mt-3 flex flex-col gap-3 rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-soft)] px-4 py-3 shadow-neo-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-[var(--accent-text-dark)]">
            Currency symbol
          </p>
          <p className="text-xs text-[var(--foreground)]">
            Choose the symbol shown before amounts.
          </p>
        </div>
        <Select
          value={currencySymbol}
          onChange={(e) => onSetCurrencySymbol(e.target.value)}
          aria-label="Currency symbol"
          containerClassName="w-full sm:w-44"
          className="text-xs font-bold uppercase"
        >
          {CURRENCY_OPTIONS.map((option) => (
            <option key={option.code} value={option.symbol}>
              {option.code} ({option.symbol})
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
