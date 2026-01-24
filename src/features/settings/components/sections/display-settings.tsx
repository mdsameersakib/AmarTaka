import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

type DisplaySettingsProps = {
  showCents: boolean;
  onToggleCents: () => void;
  currencySymbol: string;
  onSetCurrencySymbol: (value: string) => void;
};

const CURRENCY_OPTIONS = [
  { code: "BDT", symbol: "৳" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "INR", symbol: "₹" },
];

export function DisplaySettings({
  showCents,
  onToggleCents,
  currencySymbol,
  onSetCurrencySymbol,
}: DisplaySettingsProps) {
  return (
    <div className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo">
      <h2 className="text-xl font-black text-[#0f172a] ">Display</h2>
      <p className="text-xs text-[#0f172a]/70">
        Control how amounts are rendered across Amar Taka.
      </p>
      <div className="mt-4 flex items-center justify-between rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] px-4 py-3 shadow-neo-sm">
        <div>
          <p className="text-sm font-semibold uppercase text-[#14532d]">
            Show cents
          </p>
          <p className="text-xs text-[#0f172a]/70">
            Toggle between whole amounts and two decimal places.
          </p>
        </div>
        <Button
          type="button"
          onClick={onToggleCents}
          className={
            showCents
              ? "btn-neo rounded-2xl border-2 border-[#0f172a] bg-[#22c55e] px-4 py-2 text-xs font-black uppercase text-[#0f172a] shadow-neo-sm"
              : "btn-neo rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-2 text-xs font-black uppercase text-[#0f172a] shadow-neo-sm"
          }
        >
          {showCents ? "On" : "Off"}
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] px-4 py-3 shadow-neo-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-[#14532d]">
            Currency symbol
          </p>
          <p className="text-xs text-[#0f172a]/70">
            Choose the symbol shown before amounts.
          </p>
        </div>
        <Select
          value={currencySymbol}
          onChange={(event) => onSetCurrencySymbol(event.target.value)}
          aria-label="Currency symbol"
          containerClassName="w-full sm:w-40"
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
