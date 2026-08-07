import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type DangerZoneProps = {
  onReset: () => void;
};

export function DangerZone({ onReset }: DangerZoneProps) {
  return (
    <section className="rounded-[32px] border-4 border-[#0f172a] bg-[#fee2e2] p-6 shadow-neo">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7f1d1d]">
            Danger Zone
          </p>
          <h2 className="text-2xl font-black text-[#7f1d1d] ">
            Reset Demo Data
          </h2>
          <p className="text-sm text-[#7f1d1d]/70/80">
            Replace your local data with a fresh Amar Taka demo dataset.
          </p>
        </div>
        <Button
          onClick={onReset}
          className="btn-neo gap-2 rounded-2xl border-2 border-[#7f1d1d] bg-white px-5 py-3 font-black uppercase text-[#7f1d1d] shadow-neo-sm "
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </section>
  );
}
