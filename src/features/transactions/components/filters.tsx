"use client";

import { Filter, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
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
        active ? "bg-[#22c55e]" : "bg-white",
      )}
    >
      {label}
    </button>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

export function SelectField({
  label,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-2 rounded-2xl border-2 border-[#0f172a] bg-white p-4 shadow-neo-sm">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f172a]/60/60">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border-2 border-[#0f172a] bg-white px-3 py-2 font-semibold shadow-neo-sm focus:outline-none  "
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? "All" : option}
          </option>
        ))}
      </select>
    </label>
  );
}

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
    <div className="rounded-2xl border-2 border-[#0f172a] bg-[#ecfccb] p-4 shadow-neo-sm">
      <div className="flex items-center gap-2 rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-2 shadow-neo-sm ">
        <Search className="h-4 w-4 text-[#0f172a]/60" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search category, wallet, note"
          className="border-0 bg-transparent p-0 text-sm font-semibold focus-visible:ring-0"
        />
      </div>
      <p className="mt-3 text-xs font-semibold uppercase text-[#14532d]">
        {resultsCount} results
      </p>
    </div>
  );
}

export function FilterSummary({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-3 rounded-2xl border-2 border-[#0f172a] bg-white p-4 shadow-neo-sm">
      {children}
      <div className="flex-1" />
      <Filter className="h-4 w-4 text-[#0f172a]/40" />
    </div>
  );
}
