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
        "btn-neo rounded-2xl border-2 border-[var(--border)] px-3 py-1 text-xs font-black uppercase tracking-wide",
        active
          ? "bg-[var(--accent-primary)] text-[var(--accent-contrast)]"
          : "bg-white text-[var(--foreground)]",
      )}
    >
      {label}
    </button>
  );
}
