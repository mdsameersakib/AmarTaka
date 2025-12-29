import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchFilterProps = {
  search: string;
  onSearchChange: (value: string) => void;
  resultsCount: number;
};

export function SearchFilter({
  search,
  onSearchChange,
  resultsCount,
}: SearchFilterProps) {
  return (
    <div className="rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] p-4 shadow-neo-sm dark:border-[#4ade80] dark:bg-[#052e16]">
      <div className="flex items-center gap-2 rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-2 shadow-neo-sm dark:border-[#4ade80] dark:bg-black">
        <Search className="h-4 w-4 text-[#0f172a]/60 dark:text-[#bbf7d0]" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search category, wallet, note"
          className="border-0 bg-transparent p-0 text-sm font-semibold focus-visible:ring-0"
        />
      </div>
      <p className="mt-3 text-xs font-semibold uppercase text-[#14532d] dark:text-[#bbf7d0]">
        {resultsCount} results
      </p>
    </div>
  );
}
