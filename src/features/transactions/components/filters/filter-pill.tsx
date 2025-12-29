import { cn } from "@/lib/utils";

type FilterPillProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export function FilterPill({ label, active, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "btn-neo rounded-2xl border-2 border-[#0f172a] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#0f172a]",
        active ? "bg-[#22c55e]" : "bg-white dark:bg-black dark:text-[#bbf7d0]",
      )}
    >
      {label}
    </button>
  );
}
