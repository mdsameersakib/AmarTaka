"use client";

import { Filter, Search } from "lucide-react";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
  const selectId = useId();

  return (
    <label
      htmlFor={selectId}
      className="flex flex-col gap-2 rounded-2xl border-2 border-[var(--border)] bg-white p-4 shadow-neo-sm"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]">
        {label}
      </span>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        id={selectId}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? "All" : option}
          </option>
        ))}
      </Select>
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
    <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--accent-soft)] p-4 shadow-neo-sm">
      <div className="flex items-center gap-2 rounded-2xl border-2 border-[var(--border)] bg-white px-4 py-2 shadow-neo-sm ">
        <Search className="h-4 w-4 text-[var(--foreground)]" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search category, wallet, note"
          className="border-0 bg-transparent p-0 text-sm font-semibold focus-visible:ring-0"
        />
      </div>
      <p className="mt-3 text-xs font-semibold uppercase text-[var(--accent-text-dark)]">
        {resultsCount} results
      </p>
    </div>
  );
}

export function FilterSummary({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-3 rounded-2xl border-2 border-[var(--border)] bg-white p-4 shadow-neo-sm">
      {children}
      <div className="flex-1" />
      <Filter className="h-4 w-4 text-[var(--foreground)]" />
    </div>
  );
}
