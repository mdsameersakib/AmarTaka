import { Filter } from "lucide-react";

export function FilterSummary({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-3 rounded-2xl border-2 border-[var(--border)] bg-white p-4 shadow-neo-sm">
      {children}
      <div className="flex-1" />
      <Filter className="h-4 w-4 text-[var(--foreground)]" />
    </div>
  );
}
