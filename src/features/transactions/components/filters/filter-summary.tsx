import { Filter } from "lucide-react";

export function FilterSummary({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-3 rounded-2xl border-2 border-[#0f172a] bg-white p-4 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#030712]">
      {children}
      <div className="flex-1" />
      <Filter className="h-4 w-4 text-[#0f172a]/40 dark:text-[#4ade80]" />
    </div>
  );
}
