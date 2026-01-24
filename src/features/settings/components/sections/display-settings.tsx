import { Button } from "@/components/ui/button";

type DisplaySettingsProps = {
  showCents: boolean;
  onToggleCents: () => void;
};

export function DisplaySettings({
  showCents,
  onToggleCents,
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
    </div>
  );
}
