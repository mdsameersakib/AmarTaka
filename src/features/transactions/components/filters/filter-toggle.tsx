import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterToggleProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function FilterToggle({ isOpen, onToggle }: FilterToggleProps) {
  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-[#0f172a] shadow-neo-sm transition hover:-translate-y-0.5 hover:bg-[#fefce8]"
      >
        <span>Filters</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>
    </div>
  );
}
